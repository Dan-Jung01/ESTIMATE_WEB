import axios from 'axios';
const API_URL = "http://112.163.172.167:4000";
// export const api = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true });
// export const api = axios.create({ baseURL: 'http://192.168.0.50:4000/api', withCredentials: true });
export const api = axios.create({ baseURL: API_URL, withCredentials: true });
