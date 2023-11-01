const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function useApiAuth() {
  async function signup(firstname, lastname, email, password, passwordConfirm) {
    const body = {
      firstname,
      lastname,
      email,
      password,
      passwordConfirm,
    };

    const response = await fetch(`${apiBaseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Signup is failed');
      error.data = data;
      return Promise.reject(error);
    }

    return Promise.resolve(data);
  }

  async function login(email, password) {
    const body = {
      email,
      password,
    };

    const response = await fetch(`${apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Login is failed');
      error.data = data;
      return Promise.reject(error);
    }
    return Promise.resolve(data);
  }

  async function logout() {
    const response = await fetch(`${apiBaseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) return Promise.reject(new Error('Logout is failed'));
    const data = await response.json();
    return Promise.resolve(data);
  }

  async function refreshToken(userInfo = false) {
    const searchParam = new URLSearchParams({ userInfo });
    const response = await fetch(`${apiBaseUrl}/refresh?${searchParam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Authentification is failed');
      error.data = data;
      error.response = response;
      return Promise.reject(error);
    }
    return Promise.resolve({ response, data });
  }

  async function forgotPassword(email, resetUrl) {
    const body = {
      email,
      resetUrl,
    };

    const response = await fetch(`${apiBaseUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Getting password reset token is failed');
      error.data = data;
      return Promise.reject(error);
    }
    return Promise.resolve(data);
  }

  async function resetPassword(passwordResetToken, newPassword, newPasswordConfirm) {
    const body = {
      passwordResetToken,
      newPassword,
      newPasswordConfirm,
    };

    const response = await fetch(`${apiBaseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error('Resetting password is failed');
      error.data = data;
      return Promise.reject(error);
    }
    return Promise.resolve(data);
  }

  return {
    signup,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
  };
}
