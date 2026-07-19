const SkeletonBlock = ({ className = '' }) => <div className={`animate-pulse rounded-control bg-border/70 ${className}`} />;

export const DashboardSkeleton = () => (
  <div aria-busy="true" aria-label="Loading dashboard" className="space-y-layout">
    <div className="space-y-3"><SkeletonBlock className="h-8 w-64" /><SkeletonBlock className="h-5 w-80" /></div>
    <div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <SkeletonBlock className="h-32" key={item} />)}</div>
    <div className="grid gap-gutter lg:grid-cols-2">{[1, 2].map((item) => <SkeletonBlock className="h-72" key={item} />)}</div>
  </div>
);
