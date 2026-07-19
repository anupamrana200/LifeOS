import { httpClient } from '@/lib';

const unwrap = (response) => response.data?.data;

export const fetchDocuments = async (params) => unwrap(await httpClient.get('/documents', { params }));
export const fetchDocument = async (documentId) => unwrap(await httpClient.get(`/documents/${documentId}`));
export const uploadDocument = async ({ file, metadata, onProgress, signal }) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('title', metadata.title);
  formData.append('category', metadata.category);
  if (metadata.description) formData.append('description', metadata.description);
  if (metadata.tags) formData.append('tags', metadata.tags);
  return unwrap(await httpClient.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (event) => onProgress?.(event.total ? Math.round((event.loaded * 100) / event.total) : 0), signal }));
};
export const updateDocument = async (documentId, payload) => unwrap(await httpClient.patch(`/documents/${documentId}`, payload));
export const deleteDocument = async (documentId) => unwrap(await httpClient.delete(`/documents/${documentId}`));
export const downloadDocument = async (documentId) => httpClient.get(`/documents/${documentId}/download`, { responseType: 'blob' });
export const previewDocument = async (documentId) => httpClient.get(`/documents/${documentId}/preview`, { responseType: 'blob' });
export const processDocument = async (documentId) => unwrap(await httpClient.post(`/ai/documents/${documentId}/process`, {
  documentType: 'generic',
  model: 'gpt-5-mini',
  modelProvider: 'openai',
  task: 'summary',
}));
