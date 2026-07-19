import { Bot } from 'lucide-react';

export const EmptyChat = () => (
  <section className="flex min-h-full flex-col items-center justify-center px-gutter py-layout text-center"><div className="flex size-14 items-center justify-center rounded-panel bg-primary text-content-inverse shadow-card"><Bot aria-hidden="true" size={27} /></div><h3 className="mt-gutter font-display text-xl font-semibold text-content-primary">How can I help today?</h3><p className="mt-2 max-w-md text-sm leading-6 text-content-secondary">Start a conversation or ask a question about your uploaded knowledge.</p></section>
);
