import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { documentService } from '@/services';
import { getFriendlyDocumentError } from '@/utils';
import DocumentContext from './DocumentContext';

const defaultFilters = { category: '', date: '', status: '' };
const getDocumentId = (document) => document?.id || document?._id;

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({ limit: 12, page: 1, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('-createdAt');
  const [view, setView] = useState('grid');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const controllers = useRef(new Map());

  const fetchPage = useCallback(async ({ page = 1 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.fetchDocuments({ category: filters.category || undefined, limit: pagination.limit, page, search: search || undefined, sort });
      setDocuments(data?.documents || []);
      setPagination(data?.pagination || { limit: pagination.limit, page, total: 0, totalPages: 1 });
    } catch (fetchError) { setError(getFriendlyDocumentError(fetchError)); } finally { setLoading(false); }
  }, [filters.category, pagination.limit, search, sort]);

  const refresh = useCallback(() => fetchPage({ page: pagination.page }), [fetchPage, pagination.page]);
  const setPage = useCallback((page) => fetchPage({ page }), [fetchPage]);

  useEffect(() => { fetchPage({ page: 1 }); }, [fetchPage]);
  useEffect(() => {
    if (!documents.some((documentItem) => ['pending', 'processing'].includes(documentItem.aiStatus))) return undefined;
    const interval = window.setInterval(refresh, 8000);
    return () => window.clearInterval(interval);
  }, [documents, refresh]);
  useEffect(() => () => controllers.current.forEach((controller) => controller.abort()), []);

  const uploadFiles = useCallback(async (files, metadata) => {
    const queued = files.map((file) => ({ file, id: `${file.name}-${file.lastModified}-${Math.random()}`, metadata: { ...metadata, title: files.length === 1 && metadata.title ? metadata.title : file.name.replace(/\.[^.]+$/, '') }, progress: 0, status: 'uploading' }));
    setUploadQueue((current) => [...current, ...queued]);
    const results = await Promise.all(queued.map(async (item) => {
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      try {
        const data = await documentService.uploadDocument({ file: item.file, metadata: item.metadata, onProgress: (progress) => setUploadQueue((current) => current.map((queueItem) => queueItem.id === item.id ? { ...queueItem, progress } : queueItem)), signal: controller.signal });
        const uploadedDocument = data?.document;
        const documentId = getDocumentId(uploadedDocument);
        setUploadQueue((current) => current.map((queueItem) => queueItem.id === item.id ? { ...queueItem, document: uploadedDocument, progress: 100, status: documentId ? 'indexing' : 'completed' } : queueItem));
        if (documentId) {
          documentService.processDocument(documentId)
            .catch(() => setUploadQueue((current) => current.map((queueItem) => queueItem.id === item.id ? { ...queueItem, status: 'indexing failed' } : queueItem)));
        }
        return true;
      } catch (uploadError) {
        const status = uploadError.name === 'CanceledError' || uploadError.name === 'AbortError' ? 'cancelled' : 'failed';
        setUploadQueue((current) => current.map((queueItem) => queueItem.id === item.id ? { ...queueItem, error: status === 'failed' ? getFriendlyDocumentError(uploadError) : null, status } : queueItem));
        return false;
      } finally { controllers.current.delete(item.id); }
    }));
    await fetchPage({ page: 1 });
    return { failed: results.filter((result) => !result).length, successful: results.filter(Boolean).length };
  }, [fetchPage]);

  const cancelUpload = useCallback((queueId) => controllers.current.get(queueId)?.abort(), []);
  const removeQueueItem = useCallback((queueId) => setUploadQueue((current) => current.filter((item) => item.id !== queueId)), []);
  const retryUpload = useCallback((queueId) => {
    const item = uploadQueue.find((queueItem) => queueItem.id === queueId);
    if (item) { removeQueueItem(queueId); uploadFiles([item.file], item.metadata); }
  }, [removeQueueItem, uploadFiles, uploadQueue]);

  const deleteDocument = useCallback(async (documentId) => {
    try {
      await documentService.deleteDocument(documentId);
      setDocuments((current) => current.filter((documentItem) => documentItem.id !== documentId));
      setSelectedDocument((current) => current?.id === documentId ? null : current);
      refresh();
    } catch (deleteError) { setError(getFriendlyDocumentError(deleteError)); }
  }, [refresh]);

  const renameDocument = useCallback(async (documentId, title) => {
    try {
      const data = await documentService.updateDocument(documentId, { title });
      const updated = data?.document;
      setDocuments((current) => current.map((documentItem) => documentItem.id === documentId ? updated : documentItem));
      setSelectedDocument((current) => current?.id === documentId ? updated : current);
    } catch (renameError) { setError(getFriendlyDocumentError(renameError)); }
  }, []);

  const downloadDocument = useCallback(async (documentItem) => {
    try {
      const response = await documentService.downloadDocument(documentItem.id);
      const url = URL.createObjectURL(response.data);
      const anchor = window.document.createElement('a');
      anchor.href = url;
      anchor.download = documentItem.originalFileName || documentItem.title;
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (downloadError) { setError(getFriendlyDocumentError(downloadError)); }
  }, []);

  const previewDocument = useCallback(async (documentItem) => {
    try {
      return await documentService.previewDocument(documentItem.id);
    } catch (previewError) {
      setError(getFriendlyDocumentError(previewError));
      return null;
    }
  }, []);

  const reindexDocument = useCallback(async (documentId) => {
    try {
      await documentService.processDocument(documentId);
      setDocuments((current) => current.map((documentItem) => documentItem.id === documentId ? { ...documentItem, aiStatus: 'processing' } : documentItem));
      window.setTimeout(refresh, 1000);
      return true;
    } catch (processError) {
      setError(getFriendlyDocumentError(processError));
      return false;
    }
  }, [refresh]);

  const filteredDocuments = useMemo(() => documents.filter((documentItem) => (!filters.status || documentItem.aiStatus === filters.status) && (!filters.date || new Date(documentItem.createdAt).toISOString().slice(0, 10) === filters.date)), [documents, filters.date, filters.status]);
  const value = useMemo(() => ({ cancelUpload, deleteDocument, documents: filteredDocuments, downloadDocument, error, filters, isLoading, pagination, previewDocument, refresh, reindexDocument, removeQueueItem, renameDocument, retryUpload, search, selectedDocument, setFilters, setPage, setSearch, setSelectedDocument, setSort, setView, sort, uploadFiles, uploadQueue, view }), [cancelUpload, deleteDocument, downloadDocument, error, filteredDocuments, filters, isLoading, pagination, previewDocument, refresh, reindexDocument, removeQueueItem, renameDocument, retryUpload, search, selectedDocument, setPage, sort, uploadFiles, uploadQueue, view]);
  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};
