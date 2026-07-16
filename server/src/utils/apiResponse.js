const sendResponse = (res, { statusCode, message, data } = {}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export default sendResponse;
