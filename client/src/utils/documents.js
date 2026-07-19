export const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
};
export const formatDocumentDate = (value) => value ? new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
export const getDocumentStatus = (document) => document.aiStatus === 'completed' ? 'Indexed' : document.aiStatus === 'processing' ? 'Processing' : document.aiStatus === 'failed' ? 'Failed' : 'Uploading';
export const getFriendlyDocumentError = (error) => {
  const status = error?.response?.status;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to access this document.';
  if (status === 404) return 'This document is no longer available.';
  if (status === 413) return 'This file exceeds the upload size limit.';
  if (status >= 500) return 'The document service is temporarily unavailable.';
  return error?.response?.data?.message || error?.message || 'Something went wrong while handling this document.';
};
