import { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';
import { MAX_DOCUMENT_SIZE, SUPPORTED_DOCUMENT_TYPES } from '@/constants';
import { cn, formatFileSize } from '@/utils';

export const UploadDropzone = ({ onFiles }) => {
  const inputRef = useRef(null);
  const [isDragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState('');
  const receiveFiles = (files) => { const candidates = Array.from(files); const validFiles = candidates.filter((file) => file.size <= MAX_DOCUMENT_SIZE && SUPPORTED_DOCUMENT_TYPES.includes(file.type)); setValidationError(validFiles.length === candidates.length ? '' : 'One or more files are not supported or exceed the 10 MB limit.'); if (validFiles.length) onFiles(validFiles); };
  return <div className={cn('rounded-panel border border-dashed p-layout text-center transition-colors duration-theme', isDragging ? 'border-primary bg-primary/10' : 'border-border bg-canvas')} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setDragging(false); receiveFiles(event.dataTransfer.files); }}><FileUp aria-hidden="true" className="mx-auto text-primary" size={28} /><h3 className="mt-3 font-display text-sm font-semibold text-content-primary">Drop files here or browse</h3><p className="mt-1 text-xs leading-5 text-content-secondary">PDF, Word, Excel, JPEG, PNG, or WEBP · up to {formatFileSize(MAX_DOCUMENT_SIZE)} each</p><button className="mt-gutter rounded-control border border-border bg-card px-3 py-2 text-sm font-medium text-content-primary hover:bg-surface" onClick={() => inputRef.current?.click()} type="button">Choose files</button><input accept={SUPPORTED_DOCUMENT_TYPES.join(',')} className="sr-only" multiple onChange={(event) => receiveFiles(event.target.files)} ref={inputRef} type="file" />{validationError && <p className="mt-3 text-xs text-danger" role="alert">{validationError}</p>}</div>;
};
