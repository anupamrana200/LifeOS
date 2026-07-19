let accessToken = null;
let unauthorizedHandler = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const notifyUnauthorized = () => {
  unauthorizedHandler?.();
};
