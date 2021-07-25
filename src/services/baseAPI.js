import axios from "axios";

const baseURL = "https://api.clockify.me/api/v1";
const reportsURL = "https://reports.api.clockify.me/";

const baseAPI = axios.create({
  baseURL,
  timeout: 10000,
});

export const reportsAPI = axios.create({
  baseURL: reportsURL,
  timeout: 10000,
});

export default baseAPI;
