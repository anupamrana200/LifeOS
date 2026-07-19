export const AuthDivider = ({ label = 'or' }) => (
  <div className="my-gutter flex items-center gap-3" aria-hidden="true">
    <span className="h-px flex-1 bg-border" />
    <span className="text-xs text-content-muted">{label}</span>
    <span className="h-px flex-1 bg-border" />
  </div>
);
