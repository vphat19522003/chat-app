import axios from "axios";

const axiosCustom = axios.create({
  baseURL: "http://localhost:5033/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosCustom;
