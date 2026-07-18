const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (
    value &&
    typeof value === 'object'
  ) {
    const normalized = {};

    for (const [key, val] of Object.entries(value)) {
      normalized[key] = normalizeValue(val);
    }

    return normalized;
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
};

export const normalizeResponse = (data) => {
  return normalizeValue(data);
};