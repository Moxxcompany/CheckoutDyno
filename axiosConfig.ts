import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
console.log("baseUrl", apiBaseUrl);

// Build baseURL safely - use relative path if no base URL configured
const getBaseUrl = () => {
  if (!apiBaseUrl) {
    return '/api/';
  }
  try {
    return new URL('/api/', apiBaseUrl).href;
  } catch {
    return '/api/';
  }
};

const axiosBaseApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosBaseApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete axiosBaseApi.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => console.error(error)
);

export default axiosBaseApi;
