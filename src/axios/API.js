import axios from 'axios';
import {getApiKey} from '../utils/LocalStorage';

const URL = 'https://fakestoreapi.com/products/';
// const URL = 'http://192.168.0.114:8000/';
export const BASE_URL = URL;

const API = async (config) => {
    const token = await getApiKey();
    if (token) {
        config.headers = {
            authorization: token,
        };
    }
    //interceptors handle network error
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        function (error) {
            if (!error.response) {
                error.response = {
                    data: 'net work error',
                    status: 500,
                };
            }
            if (error.response.status === 401) {
                console.log('Unauthorised');
            }
            return Promise.reject(error);
        },
    );
    config.baseURL = URL;
    return axios(config);
};
export default API;
