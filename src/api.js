import axios from 'axios';
const API_URL = "https://onwardly-unsweating-tammy.ngrok-free.dev";
// export const api = axios.create({ baseURL: 'http://localhost:4000/api', withCredentials: true });
// export const api = axios.create({ baseURL: 'http://192.168.0.50:4000/api', withCredentials: true });
export const api = axios.create({ baseURL: API_URL, withCredentials: true });
