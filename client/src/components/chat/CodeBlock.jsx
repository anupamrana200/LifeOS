import { Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const CodeBlock = ({ content, language = 'text' }) => {
  const [isCopied, setCopied] = useState(false);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Code copied to clipboard.');
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Unable to copy code.');
    }
  };

  return <div className="my-3 overflow-hidden rounded-card border border-border bg-secondary text-content-inverse"><div className="flex items-center justify-between border-b border-content-inverse/10 px-3 py-2"><span className="font-mono text-xs text-content-inverse/75">{language}</span><button aria-label="Copy code" className="inline-flex items-center gap-1.5 rounded-control px-1.5 py-1 text-xs text-content-inverse/80 transition-colors duration-theme hover:bg-content-inverse/10 hover:text-content-inverse" onClick={copyCode} type="button">{isCopied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}{isCopied ? 'Copied' : 'Copy'}</button></div><pre className="overflow-x-auto p-3 text-sm leading-6"><code>{content}</code></pre></div>;
};
