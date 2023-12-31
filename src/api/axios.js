import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_BASE_API_URL;

const publicApi = axios.create({
  baseURL: API_ENDPOINT,
});

const authApi = axios.create({
  baseURL: API_ENDPOINT,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default publicApi;
export { authApi };
