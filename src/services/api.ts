// api.js
import axios, {HttpStatusCode} from 'axios';
import {getUserFromStorage, storeUser} from '../store/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ResponseModel} from '../models/ResponseModel';
export const IMAGE_BASE_URL = 'https://griapi.thoothukudicorporation.org/';
const API_BASE_URL = 'https://griapi.thoothukudicorporation.org/api/napi.php/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

api.interceptors.request.use(
  async config => {
    // Retrieve token from AsyncStorage or authentication state
    const user = await getUserFromStorage();
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.error('First Error error ' + JSON.stringify(error));
    const originalRequest = error.config;

    // If the error response is a 401 and there's no retry flag, try refreshing the token
    if (
      error?.response?.status === 401 &&
      error?.response?.status !== 415 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = false;

      try {
        const user = await getUserFromStorage();
        if (user) {
          //TODO: Need to show login page, clear all stored values
          //  const response = await refreshAuth(user.refreshToken);
          // If the token refresh request is successful, update the access token and retry the original request
          //  user.token = response.data.access_token;
          //user.refreshToken = response.data.refresh_token;
          //user.expiresIn = response.data.expires_in;
          storeUser(user);
          originalRequest.headers.Authorization = `Bearer ${user.token}`;

          return axios(originalRequest);
        }
        // eslint-disable-next-line no-catch-shadow
      } catch (error) {
        console.error('Error code from refresh token is ', error);
      }
    }

    if (axios.isAxiosError(error)) {
      // Access the response status code
      const statusCode: number = error.response?.status || -1;
      console.error(
        JSON.stringify(error) + 'Request failed with status code:',
        statusCode,
      );
    } else {
      console.error('Request failed with unknown error:', error);
    }

    const code: number = error.response?.status || -1;

    if (code === HttpStatusCode.Unauthorized) {
      AsyncStorage.setItem('user', '');
      console.error('Should logout ', code);
    }
    // Code = -1 //No Network
    return Promise.reject({
      message: error,
      statusCode: code,
    } as ResponseModel);
  },
);

export default api;
