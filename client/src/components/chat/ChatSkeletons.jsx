const Skeleton = ({ className }) => <div className={`animate-pulse rounded-control bg-border/70 ${className}`} />;

export const ConversationSkeleton = () => <div aria-label="Loading conversations" className="space-y-3 p-gutter">{[1, 2, 3, 4].map((item) => <div className="flex gap-3" key={item}><Skeleton className="size-8" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-2.5 w-1/3" /></div></div>)}</div>;

export const MessageSkeleton = () => <div aria-label="Loading messages" className="space-y-gutter p-gutter">{[1, 2, 3].map((item) => <div className={item % 2 ? 'flex gap-3' : 'flex justify-end'} key={item}><Skeleton className="h-16 w-2/3" /></div>)}</div>;
