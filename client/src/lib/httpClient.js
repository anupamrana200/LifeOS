import axios from 'axios';
import { appConfig } from '@/config';
import { clearAccessToken, getAccessToken, notifyUnauthorized, setAccessToken } from './authSession';

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let refreshRequest = null;

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${appConfig.apiBaseUrl}/auth/refresh`,
    {},
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true },
  );
  const session = response.data?.data || {};
  setAccessToken(session.accessToken);
  return session.accessToken;
};

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || !request || request._retry || request.skipAuthRefresh) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      refreshRequest ||= refreshAccessToken().finally(() => {
        refreshRequest = null;
      });
      const token = await refreshRequest;

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }

      return httpClient(request);
    } catch (refreshError) {
      clearAccessToken();
      notifyUnauthorized();
      return Promise.reject(refreshError);
    }
  },
);
