import { LoaderCircle } from 'lucide-react';

export const SubmitButton = ({ children, isLoading, ...buttonProps }) => (
  <button
    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-content-inverse transition-opacity duration-theme hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    disabled={isLoading || buttonProps.disabled}
    type="submit"
    {...buttonProps}
  >
    {isLoading && <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />}
    {children}
  </button>
);
