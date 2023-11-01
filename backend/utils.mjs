import { randomBytes, timingSafeEqual, createHash, scrypt } from 'node:crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const saltBytesLen = Number(process.env.CRYPTO_SALT_BYTES_LEN);
const cryptoKeylen = Number(process.env.CRYPTO_KEYLEN);
const emailHost = process.env.EMAIL_HOST;
const emailPort = Number(process.env.EMAIL_PORT);
const emailUser = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

export function createPasswordHash(value) {
  const salt = randomBytes(saltBytesLen).toString('hex');

  return new Promise((resolve, reject) => {
    scrypt(value, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}.${derivedKey.toString('hex')}`);
    });
  });
}

export function comparePasswordHash(value, hashToCompare) {
  const [salt, key] = hashToCompare.split('.');

  return new Promise((resolve, reject) => {
    scrypt(value, salt, cryptoKeylen, (err, derivedKey) => {
      if (err) reject(err);
      const keyBuffer = Buffer.from(key, 'hex');

      resolve(timingSafeEqual(keyBuffer, derivedKey));
    });
  });
}

export function createHashHex(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function compareHashHex(value, hashToCompare) {
  const valueHash = createHash('sha256').update(value).digest('hex');
  return timingSafeEqual(Buffer.from(valueHash), Buffer.from(hashToCompare));
}

export function httpError(statusCode, errorCode, message, err) {
  // check if err is provided, if not create with the message
  let errToThrow = err;
  if (!errToThrow) {
    errToThrow = new Error(message);
    errToThrow.statusCode = statusCode;
    errToThrow.errorCode = errorCode;
    return errToThrow;
  }

  // check if custom message provided, if yes use it
  if (message) errToThrow.message = message;
  errToThrow.statusCode = statusCode;
  errToThrow.errorCode = errorCode;
  return errToThrow;
}

export async function sendEmail(to, text, subject) {
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  return transporter.sendMail({
    from: emailFrom, // sender address
    to, // list of receivers, comma-separated
    subject, // subject line
    text, // plain text body
  });
}
