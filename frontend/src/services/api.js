import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_API_URL_PROD
        : import.meta.env.VITE_API_URL ,
    withCredentials: true
});

export default api;