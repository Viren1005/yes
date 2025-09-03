import axios from "axios";

const api = axios.create({
  baseURL: "https://analyzer-5yzihou8u-viru-s-projects.vercel.app/", // backend URL
});

export default api;
