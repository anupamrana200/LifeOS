export const SocialButton = ({ children, ...buttonProps }) => (
  <button
    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control border border-border bg-surface px-4 py-2.5 text-sm font-medium text-content-primary transition-colors duration-theme hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60"
    type="button"
    {...buttonProps}
  >
    {children}
  </button>
);
