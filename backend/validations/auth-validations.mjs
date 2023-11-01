import * as validation from './validation.mjs';

// validator middlewares
export const signup = validation.validate(['body'], {
  firstname: validation.name, // body
  lastname: validation.name, // body
  email: validation.email, // body
  password: validation.passwordRequired, // body
  passwordConfirm: validation.passwordConfirm,
});

export const login = validation.validate(['body'], {
  email: validation.email, // body
  password: validation.notEmpty, // body
});

export const refresh = validation.validate(['cookies', 'query'], {
  // cookies
  refreshToken: validation.notEmpty,
  // query
  userInfo: validation.boolValue,
});

export const authenticateUser = validation.validate(['headers'], {
  authorization: {
    trim: true,
    exists: { errorMessage: 'No authorization header is provided' },
    notEmpty: { errorMessage: 'Authorization header has no data in it' },
    custom: {
      options: validation.authHeaderValidator,
    }, // headers
  },
});

export const changePassword = validation.validate(['body'], {
  currentPassword: validation.notEmpty, // body
  newPassword: validation.passwordRequired, // body
  newPasswordConfirm: validation.passwordConfirm, // body
});

export const forgotPassword = validation.validate(['body'], {
  email: validation.email, // body
  resetUrl: validation.url, // body
});

export const resetPassword = validation.validate(['body'], {
  passwordResetToken: validation.notEmpty, // body
  newPassword: validation.passwordRequired, // body
  newPasswordConfirm: validation.passwordConfirm, // body
});
