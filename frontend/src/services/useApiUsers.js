import useFetch from '../hooks/useFetch';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function useApiUsers() {
  const { fetchInterceptor } = useFetch();

  const getOwnUser = async () => {
    const data = await fetchInterceptor(`${baseUrl}/users`);
    return data.user;
  };

  const updateOwnUser = async (firstname, lastname, email) => {
    const body = JSON.stringify({ firstname, lastname, email });

    const data = await fetchInterceptor(`${baseUrl}/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    return data;
  };

  const deleteOwnUser = async () => {
    const data = await fetchInterceptor(`${baseUrl}/users`, {
      method: 'DELETE',
    });
    return data;
  };

  const changePassword = async (currentPassword, newPassword, newPasswordConfirm) => {
    const body = JSON.stringify({ currentPassword, newPassword, newPasswordConfirm });

    const data = await fetchInterceptor(`${baseUrl}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    return data;
  };

  return {
    getOwnUser,
    updateOwnUser,
    deleteOwnUser,
    changePassword,
  };
}
