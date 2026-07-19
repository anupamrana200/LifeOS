import { forwardRef } from 'react';
import { cn } from '@/utils';

export const AuthInput = forwardRef(({ error, hint, id, label, name, type = 'text', ...inputProps }, ref) => {
  const inputId = id || name;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-content-primary" htmlFor={inputId}>{label}</label>}
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={cn('block w-full rounded-control border bg-surface px-3 py-2.5 text-sm text-content-primary outline-none transition-colors duration-theme placeholder:text-content-muted focus:border-primary', error ? 'border-danger' : 'border-border')}
        id={inputId}
        name={name}
        ref={ref}
        type={type}
        {...inputProps}
      />
      {hint && <p className="text-xs text-content-muted" id={hintId}>{hint}</p>}
      {error && <p className="text-xs text-danger" id={errorId} role="alert">{error.message}</p>}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';
