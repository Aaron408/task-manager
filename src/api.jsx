import axios from "axios";

const getToken = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    return parsedUser.token || null;
  }
  return null;
};

export const AuthApi = axios.create({
  baseURL: "https://task-manager-auth-psttogp3k-aarons-projects-ab43df53.vercel.app/",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  },
});

export const GroupsApi = axios.create({
  baseURL:
    "https://task-manager-groups-303y8n9rt-aarons-projects-ab43df53.vercel.app/",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  },
});

export const TasksApi = axios.create({
  baseURL:
    "https://task-manager-tasks-9f4m282x4-aarons-projects-ab43df53.vercel.app/",
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PATCH",
  },
});

export const UsersApi = axios.create({
  baseURL:
    "https://tasks-manager-users-93unxbv38-aarons-projects-ab43df53.vercel.app/",
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
          localStorage.removeItem("user");
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
