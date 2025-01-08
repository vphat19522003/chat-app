import axios from "axios";

const axiosCustom = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5033/api"
      : "/api",
  withCredentials: true,
});

export default axiosCustom;
