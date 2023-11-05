import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import userRoutes from './routes/user-routes.mjs';
import authRoutes from './routes/auth-routes.mjs';
import noteRoutes from './routes/note-routes.mjs';
import { httpError } from './utils.mjs';
import redisClient from './redis.mjs';
import UserModel from './models/user-model.mjs';

dotenv.config();

// env
const nodeEnv = process.env.NODE_ENV;
const appPort = Number(process.env.APP_PORT);
const appHost = process.env.APP_HOST;
const payloadLimit = process.env.PAYLOAD_LIMIT;
const corsAllowOrigins = process.env.CORS_ALLOW_ORIGINS.split(';');
const mongoDbConnStr = process.env.MONGODB_CONN_STRING.replace('<username>', process.env.MONGODB_USERNAME)
  .replace('<password>', process.env.MONGODB_PASSWORD)
  .replace('<db>', process.env.MONGODB_NAME);

// workaround for timeout issue
const redisPing = setInterval(function () {
  redisClient.set('ping', 'pong', 'EX', 120);
}, 1000 * 10);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests', errorCode: 'too_many_requests' },
  validate: { xForwardedForHeader: false },
});

const corsOptions = {
  origin: corsAllowOrigins,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json({ limit: payloadLimit }));
app.use(cookieParser());

// api routes
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);
app.get('/api/v1/health-check', async (req, res, next) => {
  try {
    // check MongoDB
    if (mongoose.connection.readyState !== 1) throw Error('MongoDB connection is not up');
    // check Redis
    await redisClient.ping();

    res.status(200).json({
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'not ok',
    });
  }
});

// handle undefined routes
app.use('/', (req, res, next) => {
  return next(httpError(404, 'not_found', 'API resource is not found'));
});

// error logging in development
app.use((err, req, res, next) => {
  if (nodeEnv === 'development') console.log(err);
  return next(err);
});

// error handling
app.use((err, req, res, next) => {
  // hide HTTP 5xx details in prod
  if (String(err.statusCode).startsWith('5') && nodeEnv === 'production') err.message = 'Internal server error';

  // check for payload limit error
  if (err.type === 'entity.too.large') {
    err.message = 'Payload too large';
    err.errorCode = 'payload_too_large';
  }

  // send a response
  res.status(err.statusCode).json({
    message: err.message || 'Something went wrong',
    errorCode: err.errorCode || 'internal_error',
    errors: err.errors,
  });
});

try {
  // connect MongoDB
  mongoose.connect(mongoDbConnStr);

  // event handler for successful connection
  mongoose.connection.on('connected', () => {
    console.log(`${new Date(Date.now()).toISOString()}: Connected to MongoDB`);
  });

  // event handler for connection errors
  mongoose.connection.on('error', error => {
    console.error(`${new Date(Date.now()).toISOString()}: MongoDB connection error:`, error);
  });

  // event handler for disconnection
  mongoose.connection.on('disconnected', () => {
    console.log(`${new Date(Date.now()).toISOString()}: Disconnected from MongoDB`);
  });

  // start an HTTP server
  if (nodeEnv === 'development') {
    app.listen(appPort, appHost, () => {
      console.log(`${new Date(Date.now()).toISOString()}: HTTP server is started on port ${appPort}`);
    });
  } else {
    app.listen(appPort, () => {
      console.log(`${new Date(Date.now()).toISOString()}: HTTP server is started on port ${appPort}`);
    });
  }
} catch (err) {
  console.error(`${new Date(Date.now()).toISOString()}: Cannot connect to MongoDB, exiting: ${err.message}`);
}

// node event handlers
process.on('exit', async code => {
  console.log(`${new Date(Date.now()).toISOString()}: App is exited with code: ${code}`);
  redisClient.quit();
  await mongoose.connection.close();
  clearInterval(redisPing);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log(`${new Date(Date.now()).toISOString()}: App is stopped with SIGINT`);
  redisClient.quit();
  await mongoose.connection.close();
  clearInterval(redisPing);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log(`${new Date(Date.now()).toISOString()}: App is stopped with SIGINT`);
  redisClient.quit();
  await mongoose.connection.close();
  clearInterval(redisPing);
  process.exit(1);
});

process.on('uncaughtException', async error => {
  console.log(`${new Date(Date.now()).toISOString()}: Exception occurred: ${error.stack}`);
  redisClient.quit();
  await mongoose.connection.close();
  clearInterval(redisPing);
  process.exit(1);
});
/*
ERRORS

internal_error:Internal server error
unauthenticated:Refresh token is invalid
unauthenticated:No refresh token found is associated with this user
unauthorized:Unauthorized
invalid_input
self_share_not_allowed:The user is the owner of the note
already_shared:The note is already shared with this email
incorrect_email_or_password:Email or password is incorrect
incorrect_password:Current password is incorrect
user_exists:A user is already exists with this email
user_not_found:A user does not exists with this email
note_not_found:Note does not exist
cannot_delete_untrashed_note:A note cannot be deleted without trashing it first
not_logged_in:User is not logged in
refresh_token_invalid:Refresh token is invalid
access_token_invalid:Access token is invalid
refresh_token_expired:Refresh token is expired
refresh_token_expired:Access token is expired
no_password_reset_request:No password reset request was found
password_reset_token_expired:Password reset token is expired
not_found:API resource is not found
too_many_requests:Too many requests
payload_too_large:Payload too large
email_unsuccess:Sending an email is failed
*/
