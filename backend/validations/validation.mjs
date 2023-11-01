import dotenv from 'dotenv';
import { checkSchema, validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { httpError } from '../utils.mjs';

dotenv.config();

// env
const nameMinLen = Number(process.env.NAME_MIN_LEN);
const nameMaxLen = Number(process.env.NAME_MAX_LEN);
const passwordMinLen = Number(process.env.PASSWORD_MIN_LEN);
const passwordMinNum = Number(process.env.PASSWORD_MIN_NUM);
const passwordMinUppercase = Number(process.env.PASSWORD_MIN_UPPERCASE);
const passwordMinLowercase = Number(process.env.PASSWORD_MIN_LOWERCASE);
const passwordMinSymbol = Number(process.env.PASSWORD_MIN_SYMBOL);
const noteTitleMaxLen = Number(process.env.NOTE_TITLE_MAX_LEN);
const noteContentMaxLen = Number(process.env.NOTE_CONTENT_MAX_LEN);
const tagNameMaxLen = Number(process.env.TAG_NAME_MAX_LEN);

// validation middleware generator
export function validate(location, schema) {
  return async function (req, res, next) {
    // run checkSchema manually
    await checkSchema(schema, location).run(req);

    // collect result and check for error(s)
    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }
    // format error(s)
    const errors = result.array({ onlyFirstError: true }).map(err => ({
      message: err.msg,
      field: err.path,
      input: err.value,
      inputLocation: err.location,
    }));

    // respond with errors
    res.status(422).json({
      message: 'Validation error',
      errorCode: 'invalid_input',
      errors,
    });
  };
}

// custom validators
export function passwordConfirmationValidator(value, { req }) {
  // compare with two different fields whichever exists in req
  const passwordToCompare = req.body.password || req.body.newPassword;
  if (value !== passwordToCompare) {
    throw new Error('Password confirmation should match the password');
  } else {
    return true;
  }
}

export function authHeaderValidator(value) {
  // check if auth header format is correct
  if (value.split(' ').length !== 2 || value.split(' ')[0] !== 'Bearer') {
    throw httpError(403, 'unauthenticated', 'Unauthenticated');
  } else {
    return true;
  }
}

export function objectIdValidator(value, { path }) {
  if (!isValidObjectId(value)) {
    throw new Error(`${path} is not a valid ID`);
  } else {
    return true;
  }
}

export function colorHexValidator(value) {
  const regexResult = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
  if (!regexResult) {
    throw Error('Not a valid color hex code');
  } else {
    return true;
  }
}

export function paginationValidator(value, { req, path }) {
  if (!Number.isInteger(Number(value)) || Number(value) < 1) {
    throw Error(`${path} must be integer greater than or equal to 1`);
  } else if (path === 'limit' && !Object.prototype.hasOwnProperty.call(req.query, 'page')) {
    throw Error(`${path} option must be used with page option`);
  } else if (path === 'page' && !Object.prototype.hasOwnProperty.call(req.query, 'page')) {
    throw Error(`${path} option must be used with limit option`);
  } else {
    return true;
  }
}

// validation fields
export const name = {
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} cannot be empty` },
  isLength: {
    options: [{ min: nameMinLen }, { max: nameMaxLen }],
    errorMessage: (value, { path }) => `${path} length should be between ${nameMinLen} and ${nameMaxLen} chars`,
  },
};

export const email = {
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} cannot be empty` },
  isEmail: { errorMessage: (value, { path }) => `${path} is not valid` },
  normalizeEmail: true,
};

export const passwordRequired = {
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} cannot be empty` },
  isStrongPassword: {
    options: [
      { minLength: passwordMinLen },
      { minLowercase: passwordMinLowercase },
      { minUppercase: passwordMinUppercase },
      { minNumbers: passwordMinNum },
      { minSymbols: passwordMinSymbol },
    ],
    errorMessage: (value, { path }) =>
      `${path} is not strong, required minLength: ${passwordMinLen}, minLowercase: ${passwordMinLowercase}, minUppercase: ${passwordMinUppercase}, minNumbers: ${passwordMinNum}, minSymbols: ${passwordMinSymbol}`,
  },
};

export const passwordConfirm = {
  custom: {
    options: passwordConfirmationValidator,
  },
};

export const objectId = {
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} should be provided` },
  custom: {
    options: objectIdValidator,
  },
};

export const notEmpty = {
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} cannot be empty` },
};

export const pagination = {
  optional: true,
  trim: true,
  notEmpty: { errorMessage: (value, { path }) => `${path} cannot be empty` },
  custom: {
    options: paginationValidator,
  },
};

export const noteTitle = {
  optional: true,
  trim: true,
  isLength: {
    options: {
      max: noteTitleMaxLen,
    },
    errorMessage: `Note title length cannot be more than ${noteTitleMaxLen} chars`,
  },
};

export const noteContent = {
  trim: true,
  isLength: {
    options: {
      max: noteContentMaxLen,
    },
    errorMessage: `Note content lenght cannot be more than ${noteContentMaxLen} chars`,
  },
};

export const colorHex = {
  trim: true,
  optional: true,
  custom: {
    options: colorHexValidator,
  },
};

export const tagName = {
  trim: true,
  notEmpty: { errorMessage: 'Tag name cannot be empty' },
  isLength: {
    options: { max: tagNameMaxLen },
    errorMessage: `Tag name cannot have more than ${tagNameMaxLen} chars`,
  },
};

export const tagsArray = {
  optional: true,
  isArray: {
    errorMessage: 'Tags should be provided as array of strings',
  },
};

export const boolValue = {
  optional: true,
  isBoolean: {
    errorMessage: (value, { path }) => `${path} can be true or false`,
  },
};

export const url = {
  isURL: {
    errorMessage: 'resetUrl is not a valid URL',
  },
};
