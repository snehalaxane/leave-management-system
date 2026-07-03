import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: redirect to login page or emit an event
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default instance;
