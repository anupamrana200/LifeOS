import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

export const PasswordInput = forwardRef(({ error, hint, id, label, name, onKeyDown, showStrength = false, value, ...inputProps }, ref) => {
  const [isVisible, setVisible] = useState(false);
  const [isCapsLockOn, setCapsLockOn] = useState(false);
  const inputId = id || name;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const capsLockId = isCapsLockOn ? `${inputId}-caps-lock` : undefined;
  const describedBy = [hintId, errorId, capsLockId].filter(Boolean).join(' ') || undefined;

  const handleKeyDown = (event) => {
    setCapsLockOn(event.getModifierState('CapsLock'));
    onKeyDown?.(event);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-content-primary" htmlFor={inputId}>{label}</label>}
      <div className="relative">
        <input
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={cn('block w-full rounded-control border bg-surface py-2.5 pl-3 pr-11 text-sm text-content-primary outline-none transition-colors duration-theme placeholder:text-content-muted focus:border-primary', error ? 'border-danger' : 'border-border')}
          id={inputId}
          name={name}
          onKeyDown={handleKeyDown}
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          value={value}
          {...inputProps}
        />
        <button
          aria-label={`${isVisible ? 'Hide' : 'Show'} password`}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-control text-content-muted transition-colors duration-theme hover:text-content-primary"
          onClick={() => setVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
      {hint && <p className="text-xs text-content-muted" id={hintId}>{hint}</p>}
      {isCapsLockOn && <p className="text-xs text-warning" id={capsLockId} role="status">Caps Lock is on.</p>}
      {error && <p className="text-xs text-danger" id={errorId} role="alert">{error.message}</p>}
      {showStrength && <PasswordStrengthMeter password={value} />}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
