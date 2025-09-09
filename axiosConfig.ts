import axios from "axios";
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
console.log("baseUrl", apiBaseUrl);
const axiosBaseApi = axios.create({
  baseURL: apiBaseUrl + "api/",
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
