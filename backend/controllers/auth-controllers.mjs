import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from '../models/user-model.mjs';
import redisClient from '../redis.mjs';
import { httpError, createHashHex, createPasswordHash, comparePasswordHash, compareHashHex } from '../utils.mjs';
import * as emailer from '../emailer.mjs';

dotenv.config();
const { ObjectId } = mongoose.Types;

// env
const accessJwtExpiration = Number(process.env.ACCESS_JWT_EXPIRATION_SECONDS);
const refreshJwtExpiration = Number(process.env.REFRESH_JWT_EXPIRATION_SECONDS);
const accessJwtSecret = process.env.ACCESS_JWT_SECRET;
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET;
const passwordResetTokenValidity = Number(process.env.PASSWORD_RESET_TOKEN_VALIDITY_SECONDS);
const saltBytesLen = Number(process.env.CRYPTO_SALT_BYTES_LEN);
const appHost = process.env.APP_HOST;

function verifyJwt(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

async function loginUser(user, statusCode, res, next, oldRefreshTokenHash) {
  try {
    const expirationDate = new Date(Date.now() + refreshJwtExpiration * 1000);
    const utcExpiration = expirationDate.toUTCString();

    // sign JWT access token
    const accessToken = jwt.sign(
      { userId: user.id, randomId: Math.floor(Math.random() * Math.random() * Date.now()) },
      accessJwtSecret,
      {
        expiresIn: accessJwtExpiration,
      }
    );

    // sign JWT refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, randomId: Math.floor(Math.random() * Math.random() * Date.now()) },
      refreshJwtSecret,
      {
        expiresIn: refreshJwtExpiration,
      }
    );

    // hash the refresh token and store in Redis set
    const refreshTokenHash = createHashHex(refreshToken);
    // remove the old refresh token from Redis set if it's provided, add a minute of timeout to keep any parallel refresh requests valid
    if (oldRefreshTokenHash) setTimeout(async () => await redisClient.srem(user.id, oldRefreshTokenHash), 60000);
    // add a newly hashed refresh token to Redis set
    await redisClient.sadd(user.id, refreshTokenHash);
    // set an expiration for Redis set
    await redisClient.expire(user.id, refreshJwtExpiration);

    // set cookie for the refresh token
    // set the cookie Secure to false in non-production env
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(utcExpiration),
      httpOnly: true,
      domain: appHost,
      secure: process.env.NODE_ENV === 'production',
    });

    // send a response
    res.status(statusCode).json({
      user,
      accessToken,
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

async function logoutUser(userId, message, res, next, refreshToken) {
  try {
    let refreshTokenHash;
    if (refreshToken) refreshTokenHash = createHashHex(refreshToken);

    // delete refreshTokenHash from Redis set which contains user's tokens, if no refreshToken is provided delete all the tokens
    if (refreshToken) await redisClient.srem(userId, refreshTokenHash);
    else await redisClient.del(userId);

    // delete refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: appHost,
      secure: process.env.NODE_ENV === 'production',
    });

    // send a response
    res.json({ message });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function signup(req, res, next) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // if there is already a user with the updated email then return
      const err = httpError(422, 'user_exists', 'A user is already exists with this email');
      // add details to identify the request field with an error
      err.errors = [
        {
          field: 'email',
          message: 'A user is already exists with this email',
          input: email,
          inputLocation: 'body',
        },
      ];

      return next(err);
    }

    // hash the password
    const hashedPassword = await createPasswordHash(password);

    // create a user in db
    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // log the user in
    await loginUser(user, 201, res, next);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function login(req, res, next) {
  try {
    const { email } = req.body;
    const { password } = req.body;

    // check if a user exists with the provided email
    const user = await UserModel.findOne({ email });

    if (!user) return next(httpError(403, 'incorrect_email_or_password', 'Email or password is incorrect'));

    // check if provided password is correct
    const isValid = await comparePasswordHash(password, user.password);
    if (!isValid) return next(httpError(403, 'incorrect_email_or_password', 'Email or password is incorrect'));

    // sign tokens
    await loginUser(user, 200, res, next);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    let decodedUserId;
    // verify token
    try {
      const decoded = await verifyJwt(refreshToken, refreshJwtSecret);
      decodedUserId = decoded.userId;
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return next(httpError(403, 'refresh_token_expired', 'Refresh token is expired'));
      return next(httpError(403, 'refresh_token_invalid', 'Refresh token is invalid'));
    }

    // log the user out
    await logoutUser(decodedUserId, 'User is logged out', res, next, refreshToken);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const userInfo = req.query.userInfo === 'true' ? true : false;
    let decodedUserId;

    // verify token
    try {
      const decoded = await verifyJwt(refreshToken, refreshJwtSecret);
      decodedUserId = decoded.userId;
    } catch (err) {
      if (err.name === 'TokenExpiredError')
        return next(httpError(403, 'refresh_token_expired', 'Refresh token is expired'));
      return next(httpError(403, 'refresh_token_invalid', 'Refresh token is invalid'));
    }

    // get hashed user's refresh tokens from Redis
    const storedRefreshTokenHashes = await redisClient.smembers(decodedUserId);

    // check if the user has a refresh token stored
    if (storedRefreshTokenHashes.length === 0) return next(httpError(403, 'not_logged_in', 'User is not logged in'));

    // compare stored token and hashed token from req cookies
    const refreshTokenHash = storedRefreshTokenHashes.find(tokenStored => {
      const res = compareHashHex(refreshToken, tokenStored);
      return res;
    });

    if (!refreshTokenHash) return next(httpError(403, 'not_logged_in', 'User is not logged in'));

    let user = {};
    if (userInfo) {
      // get user from db
      const resp = await UserModel.findById(new ObjectId(decodedUserId));
      user = resp.toJSON();
    }

    // log the user in, pass the old refresh token to update Redis set
    await loginUser({ ...user, id: decodedUserId }, 200, res, next, refreshTokenHash);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function authenticateUser(req, res, next) {
  const accessToken = req.headers.authorization.split(' ')[1];

  // verify token
  try {
    const decoded = await verifyJwt(accessToken, accessJwtSecret);
    req.user = { userId: decoded.userId };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return next(httpError(401, 'access_token_expired', 'Access token is expired'));

    return next(httpError(401, 'access_token_invalid', 'Access token is invalid'));
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.user;

    // check if user authorized
    if (userId !== req.user.userId) return next(httpError(401, 'unauthorized', 'Unauthorized'));

    // get user from db
    const user = await UserModel.findById(new ObjectId(req.user.userId));

    // check if there is a user
    if (!user) return next(httpError(422, 'user_not_found', 'User does not exist'));

    // check if provided password is correct
    const isValid = await comparePasswordHash(currentPassword, user.password);
    if (!isValid) {
      const err = httpError(422, 'incorrect_password', 'Current password is incorrect');
      // add details to identify the request field with an error
      err.errors = [
        {
          field: 'currentPassword',
          message: 'Current password is incorrect',
          input: currentPassword,
          inputLocation: 'body',
        },
      ];
      return next(err);
    }

    // hash the new password
    const newPasswordHash = await createPasswordHash(newPassword);

    // save the password to db
    user.password = newPasswordHash;
    await user.save();

    // log the user out
    await logoutUser(userId, 'Password is changed successfully', res, next);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email, resetUrl } = req.body;

    // check if there is a user with the provided email in db
    const user = await UserModel.findOne({ email });
    if (!user) return next(httpError(422, 'user_not_found', 'A user does not exists with this email'));

    // create a password reset token and expiry date
    const passwordResetToken = randomBytes(saltBytesLen).toString('hex');
    const passwordResetTokenHash = createHashHex(passwordResetToken);
    const passwordResetTokenExpiry = Date.now() + passwordResetTokenValidity * 1000;
    // store password reset info in db
    user.passwordResetToken = passwordResetTokenHash;
    user.passwordResetTokenExpiry = passwordResetTokenExpiry;
    await user.save();

    // send an email with the reset token
    try {
      const resetLink = `${resetUrl}/${user.id}:${passwordResetToken}`;
      const validity = `${passwordResetTokenValidity / 60} minutes`;
      const eres = await emailer.resetPassword(email, resetLink, validity);
    } catch (err) {
      return next(httpError(503, 'email_unsuccess', '', err));
    }

    // send a response
    res.json({
      email,
      passwordResetToken: `${user.id}:${passwordResetToken}`,
      passwordResetTokenExpiry,
      passwordResetTokenValidityInSeconds: passwordResetTokenValidity,
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function resetPassword(req, res, next) {
  try {
    // get user ID from the token
    const [userId, passwordResetToken] = req.body.passwordResetToken.split(':');
    const { newPassword } = req.body;

    // find the user in db
    const user = await UserModel.findById(new ObjectId(userId));

    // check if there is a user
    if (!user) return next(httpError(422, 'user_not_found', 'A user does not exists with this email'));

    // check if there is a forgot password request
    if (!user.passwordResetToken)
      return next(httpError(422, 'no_password_reset_request', 'No password reset request is found'));

    // check if token is expired
    if (user.passwordResetTokenExpiry < Date.now())
      return next(httpError(403, 'password_reset_token_expired', 'Password reset token is expired'));

    // check token itself
    if (!compareHashHex(passwordResetToken, user.passwordResetToken))
      return next(httpError(403, 'token_invalid', 'Token is invalid'));

    // update the password in db
    const newPasswordHash = await createPasswordHash(newPassword);
    user.password = newPasswordHash;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();

    // log the user out
    await logoutUser(userId, 'Password is reset successfully', res, next);
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}
