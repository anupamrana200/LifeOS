import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Upload } from 'lucide-react';
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

  const openDetails = (document) => { setRenameMode(false); setSelectedDocument(document); };
  const openRename = (document) => { setRenameMode(true); setSelectedDocument(document); };
  const handleRename = async (documentId, title) => { await renameDocument(documentId, title); setRenameMode(false); };
  const actions = { onDelete: (document) => deleteDocument(document.id), onDownload: downloadDocument, onRename: openRename, onView: openDetails };

  return <div className="space-y-layout">
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-2xl font-semibold text-content-primary">Knowledge Base</h2><p className="mt-2 text-sm text-content-secondary">Upload and manage the sources that enrich your LifeOS conversations.</p></div><div className="flex gap-2"><button aria-label="Refresh documents" className="inline-flex size-10 items-center justify-center rounded-control border border-border bg-card text-content-secondary hover:bg-canvas" onClick={refresh} type="button"><RefreshCw aria-hidden="true" size={17} /></button><button className="inline-flex min-h-10 items-center gap-2 rounded-control bg-primary px-4 text-sm font-semibold text-content-inverse hover:opacity-90" onClick={() => setUploadOpen(true)} type="button"><Upload aria-hidden="true" size={17} />Upload</button></div></section>
    <DocumentToolbar filters={filters} onFiltersChange={setFilters} onSearch={setSearch} onSort={setSort} onViewChange={setView} search={search} sort={sort} view={view} />
    {error && <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert"><span>{error}</span><button className="rounded-control border border-danger/30 px-2 py-1 text-xs font-medium hover:bg-danger/10" onClick={refresh} type="button">Try again</button></div>}
    {isLoading ? <DocumentSkeleton table={view === 'table'} /> : documents.length === 0 ? <EmptyKnowledgeBase onUpload={() => setUploadOpen(true)} /> : view === 'grid' ? <div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-3">{documents.map((document) => <DocumentCard document={document} key={document.id} {...actions} />)}</div> : <DocumentTable documents={documents} {...actions} />}
    {pagination.totalPages > 1 && <nav aria-label="Document pagination" className="flex items-center justify-between"><p className="text-sm text-content-secondary">Page {pagination.page} of {pagination.totalPages}</p><div className="flex gap-2"><button aria-label="Previous page" className="inline-flex size-9 items-center justify-center rounded-control border border-border bg-card text-content-secondary disabled:opacity-50" disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)} type="button"><ChevronLeft aria-hidden="true" size={17} /></button><button aria-label="Next page" className="inline-flex size-9 items-center justify-center rounded-control border border-border bg-card text-content-secondary disabled:opacity-50" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(pagination.page + 1)} type="button"><ChevronRight aria-hidden="true" size={17} /></button></div></nav>}
    <UploadDialog isOpen={isUploadOpen} onCancelUpload={cancelUpload} onClose={() => setUploadOpen(false)} onRemoveQueueItem={removeQueueItem} onRetryUpload={retryUpload} onUpload={uploadFiles} queue={uploadQueue} />
    <DocumentDetailsDrawer document={selectedDocument} isOpen={Boolean(selectedDocument)} onClose={() => setSelectedDocument(null)} onRename={handleRename} renameMode={renameMode} />
  </div>;
};
