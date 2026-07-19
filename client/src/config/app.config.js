const appConfig = Object.freeze({
  name: import.meta.env.VITE_APP_NAME || 'LifeOS',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
});

export default appConfig;
export { appConfig };
