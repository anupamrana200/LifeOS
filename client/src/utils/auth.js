export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => (
  error?.response?.data?.message || error?.message || fallback
);

export const applyApiFieldErrors = (error, setError) => {
  const details = error?.response?.data?.details;

  if (!Array.isArray(details)) return false;

  details.forEach((detail) => {
    const field = detail.path || detail.param;
    if (field) setError(field, { message: detail.msg || detail.message || 'Please check this field.', type: 'server' });
  });

  return details.length > 0;
};
