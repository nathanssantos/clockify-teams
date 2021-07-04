import axios from "axios";

const baseURL = "https://api.clockify.me/api/v1";

const baseAPI = axios.create({
  baseURL,
  timeout: 10000,
});

export default baseAPI;
