import axios from "axios";

const API_BASE_URL = "https://majorsshop-backend-api.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
