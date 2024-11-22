import baseApi from "./baseApi";

const tokenHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

const crudApi = {
  read: (source, where) => {
    return baseApi.post(`/api/read?source=${source}`, {
      source: source,
      where: where,
    },
    tokenHeader);
  },
  create: (source, data) => {
    return baseApi.post(`/api/create?source=${source}`, {
      source: source,
      data: data,
    },
    tokenHeader);
  },
  update: (source, where, data) => {
    return baseApi.post(`/api/update?source=${source}`, {
      source: source,
      where: where,
      data: data,
    },
    tokenHeader);
  },
  delete: (source, where) => {
    return baseApi.post(`/api/delete?source=${source}`, {
      source: source,
      where: where,
    },
    tokenHeader);
  },
};

export default crudApi;