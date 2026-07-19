import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DocumentCard,
  DocumentDetailsDrawer,
  DocumentSkeleton,
  DocumentTable,
  DocumentToolbar,
  EmptyKnowledgeBase,
  UploadDialog,
} from '@/components/documents';
import { useDocuments } from '@/hooks';

export const DocumentsPage = () => {
  const {
    cancelUpload,
    deleteDocument,
    documents,
    downloadDocument,
    error,
    filters,
    isLoading,
    pagination,
    previewDocument,
    reindexDocument,
    refresh,
    removeQueueItem,
    renameDocument,
    retryUpload,
    search,
    selectedDocument,
    setFilters,
    setPage,
    setSearch,
    setSelectedDocument,
    setSort,
    setView,
    sort,
    uploadFiles,
    uploadQueue,
    view,
  } = useDocuments();
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [renameMode, setRenameMode] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const [preview, setPreview] = useState(null);

  const openDetails = (document) => { setRenameMode(false); setSelectedDocument(document); };
  const openRename = (document) => { setRenameMode(true); setSelectedDocument(document); };
  const handleRename = async (documentId, title) => { await renameDocument(documentId, title); setRenameMode(false); };
  const openPreview = async (document) => {
    const response = await previewDocument(document);
    if (!response) return;
    setPreview({ document, url: URL.createObjectURL(response.data) });
  };
  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };
  const confirmDeletion = async () => {
    if (!pendingDeletion) return;
    await deleteDocument(pendingDeletion.id);
    setPendingDeletion(null);
  };
  const handleUpload = async (files, metadata) => {
    const result = await uploadFiles(files, metadata);
    if (result.successful) {
      toast.success(`${result.successful} document${result.successful === 1 ? '' : 's'} uploaded successfully. Indexing is now running.`);
      setUploadOpen(false);
    }
  };
  const handleReindex = async (documentOrId) => {
    const documentId = typeof documentOrId === 'string' ? documentOrId : documentOrId?.id || documentOrId?._id;
    if (!documentId) return;
    if (await reindexDocument(documentId)) toast.success('Indexing has started.');
  };
  const actions = { onDelete: setPendingDeletion, onDownload: downloadDocument, onPreview: openPreview, onReindex: handleReindex, onRename: openRename, onView: openDetails };

  return <div className="space-y-layout">
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-2xl font-semibold text-content-primary">Knowledge Base</h2><p className="mt-2 text-sm text-content-secondary">Upload and manage the sources that enrich your LifeOS conversations.</p></div><div className="flex gap-2"><button aria-label="Refresh documents" className="inline-flex size-10 items-center justify-center rounded-control border border-border bg-card text-content-secondary hover:bg-canvas" onClick={refresh} type="button"><RefreshCw aria-hidden="true" size={17} /></button><button className="inline-flex min-h-10 items-center gap-2 rounded-control bg-primary px-4 text-sm font-semibold text-content-inverse hover:opacity-90" onClick={() => setUploadOpen(true)} type="button"><Upload aria-hidden="true" size={17} />Upload</button></div></section>
    <DocumentToolbar filters={filters} onFiltersChange={setFilters} onSearch={setSearch} onSort={setSort} onViewChange={setView} search={search} sort={sort} view={view} />
    {error && <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert"><span>{error}</span><button className="rounded-control border border-danger/30 px-2 py-1 text-xs font-medium hover:bg-danger/10" onClick={refresh} type="button">Try again</button></div>}
    {isLoading ? <DocumentSkeleton table={view === 'table'} /> : documents.length === 0 ? <EmptyKnowledgeBase onUpload={() => setUploadOpen(true)} /> : view === 'grid' ? <div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-3">{documents.map((document) => <DocumentCard document={document} key={document.id} {...actions} />)}</div> : <DocumentTable documents={documents} {...actions} />}
    {pagination.totalPages > 1 && <nav aria-label="Document pagination" className="flex items-center justify-between"><p className="text-sm text-content-secondary">Page {pagination.page} of {pagination.totalPages}</p><div className="flex gap-2"><button aria-label="Previous page" className="inline-flex size-9 items-center justify-center rounded-control border border-border bg-card text-content-secondary disabled:opacity-50" disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)} type="button"><ChevronLeft aria-hidden="true" size={17} /></button><button aria-label="Next page" className="inline-flex size-9 items-center justify-center rounded-control border border-border bg-card text-content-secondary disabled:opacity-50" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(pagination.page + 1)} type="button"><ChevronRight aria-hidden="true" size={17} /></button></div></nav>}
    <UploadDialog isOpen={isUploadOpen} onCancelUpload={cancelUpload} onClose={() => setUploadOpen(false)} onRemoveQueueItem={removeQueueItem} onRetryUpload={retryUpload} onUpload={handleUpload} queue={uploadQueue} />
    <DocumentDetailsDrawer document={selectedDocument} isOpen={Boolean(selectedDocument)} onClose={() => setSelectedDocument(null)} onRename={handleRename} renameMode={renameMode} />
    {preview && <div aria-label={`Preview ${preview.document.title}`} aria-modal="true" className="fixed inset-0 z-modal flex flex-col bg-secondary/50 p-3 sm:p-layout" role="dialog"><div className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 flex-col overflow-hidden rounded-panel border border-border bg-card shadow-floating"><header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-gutter py-3"><h2 className="truncate font-display text-sm font-semibold text-content-primary">Preview: {preview.document.title}</h2><button className="rounded-control border border-border px-3 py-1.5 text-sm text-content-secondary hover:bg-canvas" onClick={closePreview} type="button">Close</button></header><iframe className="min-h-0 w-full flex-1 bg-surface" src={preview.url} title={`Preview ${preview.document.title}`} /></div></div>}
    {pendingDeletion && <div aria-labelledby="delete-document-title" aria-modal="true" className="fixed inset-0 z-toast grid place-items-center bg-secondary/50 p-gutter" role="alertdialog"><section className="w-full max-w-sm rounded-panel border border-border bg-card p-layout shadow-floating"><h2 className="font-display text-lg font-semibold text-content-primary" id="delete-document-title">Delete document?</h2><p className="mt-2 text-sm leading-6 text-content-secondary">Delete “{pendingDeletion.title}”? This removes it from your knowledge base and cannot be undone.</p><div className="mt-layout flex justify-end gap-2"><button className="rounded-control border border-border px-3 py-2 text-sm font-medium text-content-secondary hover:bg-canvas" onClick={() => setPendingDeletion(null)} type="button">Cancel</button><button className="rounded-control bg-danger px-3 py-2 text-sm font-semibold text-content-inverse hover:opacity-90" onClick={confirmDeletion} type="button">Delete</button></div></section></div>}
  </div>;
};
