import axios from "axios";
import { getRegAndSessionId } from "./api"
import qs from 'qs';

export const axiosInstance = axios.create({
    baseURL: process.env.GATSBY_SWYM_BASE_URL,
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const data = qs.parse(config.data);
        const regAndSessionId = await getRegAndSessionId();
        if (!regAndSessionId) {
            throw new Error("Reg & Session id not found")
        }
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
        config.data = qs.stringify({ ...data, ...regAndSessionId })
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default axiosInstance
