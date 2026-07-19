import { Bot, Copy, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { CodeBlock } from './CodeBlock';

const copyMessage = async (content) => {
  try {
    await navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard.');
  } catch {
    toast.error('Unable to copy message.');
  }
};

export const MessageBubble = ({ message }) => {
  if (message.role === 'system') return <div className="mx-auto max-w-2xl rounded-pill border border-border bg-canvas px-3 py-1.5 text-center text-xs text-content-muted">{message.content}</div>;

  const isUser = message.role === 'user';
  const Avatar = isUser ? UserRound : Bot;
  const copyContent = [message.content, message.code?.content].filter(Boolean).join('\n\n');

  return (
    <article className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-primary text-content-inverse"><Avatar aria-hidden="true" size={16} /></span>}
      <div className={`max-w-[85%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-panel px-4 py-3 text-sm leading-6 ${isUser ? 'bg-primary text-content-inverse' : 'border border-border bg-card text-content-primary'}`}>
          <div data-markdown-ready="true" className="whitespace-pre-wrap">{message.content}</div>
          {message.code && <CodeBlock content={message.code.content} language={message.code.language} />}
          {message.sources?.length > 0 && <div className="mt-3 border-t border-border pt-3"><p className="text-xs font-medium text-content-secondary">Sources</p><ul className="mt-2 space-y-1">{message.sources.map((source, index) => <li className="text-xs text-content-muted" key={source.documentId || index}>Document {source.documentId || index + 1}{source.score ? ` · relevance ${Math.round(source.score * 100)}%` : ''}</li>)}</ul></div>}
        </div>
        <div className={`mt-1 flex items-center gap-2 text-xs text-content-muted ${isUser ? 'justify-end' : ''}`}><time>{message.timestamp}</time><button aria-label="Copy message" className="opacity-0 transition-opacity duration-theme group-hover:opacity-100 focus-visible:opacity-100" onClick={() => copyMessage(copyContent)} type="button"><Copy aria-hidden="true" size={14} /></button></div>
      </div>
      {isUser && <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-canvas text-content-secondary"><Avatar aria-hidden="true" size={16} /></span>}
    </article>
  );
};

export const UserMessage = ({ message }) => <MessageBubble message={{ ...message, role: 'user' }} />;
export const AssistantMessage = ({ message }) => <MessageBubble message={{ ...message, role: 'assistant' }} />;
export const SystemMessage = ({ message }) => <MessageBubble message={{ ...message, role: 'system' }} />;
