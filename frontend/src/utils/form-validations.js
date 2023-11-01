export default {
  firstname: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name is too short',
    },
    maxLength: {
      value: 50,
      message: 'First name is too long',
    },
  },
  lastname: {
    required: 'Last name address is required',
    minLength: {
      value: 2,
      message: 'Last name is too short',
    },
    maxLength: {
      value: 50,
      message: 'Last name is too long',
    },
  },
  email: {
    required: 'Email address is required',
    maxLength: {
      value: 254,
      message: 'Email is too long',
    },
    pattern: {
      value:
        //eslint-disable-next-line
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      message: 'Email is not a valid email',
    },
  },
  password: {
    required: 'Password is required',
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/,
      message:
        'Password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.',
    },
  },
  newPassword: {
    required: 'New password is required',
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/,
      message:
        'New password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.',
    },
  },
};
