import baseApi from './baseApi';

const authApi = {
  register: (data) => {
    const url = "/api/auth/local/register";
    return baseApi.post(url, data);
  },

  login: (data) => {
    const url = "/api/auth/local";
    return baseApi.post(url, data);
  },

  getCurrentUser: () => {
    const url = `api/users/me`;
    return baseApi.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
  
  updateUser: (id, data) => {
    const url = `api/users/${id}`;
    return baseApi.put(url, data);
  },
};

export default authApi;
