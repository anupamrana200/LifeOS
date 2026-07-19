import { useEffect, useRef, useState } from 'react';
import { Mic, Paperclip, Send, Square } from 'lucide-react';

export const MessageInput = ({ isTyping, onSend, onStop }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 176)}px`;
  }, [value]);

  const submit = () => {
    if (!value.trim() || isTyping) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return <div className="shrink-0 border-t border-border bg-card/95 px-gutter py-3 backdrop-blur"><div className="mx-auto max-w-3xl"><div className="overflow-hidden rounded-panel border border-border bg-surface shadow-card transition-[border-color,box-shadow] duration-theme focus-within:border-primary focus-within:shadow-focus"><textarea aria-label="Message LifeOS" className="block max-h-44 min-h-12 w-full resize-none overflow-y-auto bg-transparent px-4 py-3 text-sm leading-6 text-content-primary outline-none placeholder:text-content-muted" onChange={(event) => setValue(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask LifeOS anything…" ref={textareaRef} rows={1} value={value} /><div className="flex items-center justify-between gap-2 border-t border-border/70 px-2 py-2"><div className="flex min-w-0 items-center gap-1"><button aria-label="Attach file" className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-content-muted transition-colors hover:bg-canvas hover:text-content-primary" type="button"><Paperclip aria-hidden="true" size={18} /></button><button aria-label="Use microphone" className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-content-muted transition-colors hover:bg-canvas hover:text-content-primary" type="button"><Mic aria-hidden="true" size={18} /></button><span className="hidden truncate px-1 text-xs text-content-muted sm:inline">Enter to send · Shift + Enter for a new line</span></div>{isTyping ? <button aria-label="Stop generating" className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-danger text-content-inverse hover:opacity-90" onClick={onStop} type="button"><Square aria-hidden="true" size={15} /></button> : <button aria-label="Send message" className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-primary text-content-inverse transition-opacity duration-theme hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50" disabled={!value.trim()} onClick={submit} type="button"><Send aria-hidden="true" size={17} /></button>}</div></div></div></div>;
};
