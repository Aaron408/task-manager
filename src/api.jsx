import axios from "axios";

const getToken = () => {
  const userData = localStorage.getItem("token");
  return userData ? userData : null;
};

export const AuthApi = axios.create({
  baseURL: "https://task-manager-auth-ehtkeehh0-aarons-projects-ab43df53.vercel.app/",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  },
});

export const GroupsApi = axios.create({
  baseURL: "http://localhost:5002",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  },
});

export const TasksApi = axios.create({
  baseURL: "http://localhost:5003",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PATCH",
  },
});

export const UsersApi = axios.create({
  baseURL: "http://localhost:5004",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  },
});

const setupInterceptors = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (
          error.response.status === 401 &&
          !error.config.url.includes("/login")
        ) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors(AuthApi);
setupInterceptors(UsersApi);
setupInterceptors(TasksApi);
setupInterceptors(GroupsApi);
