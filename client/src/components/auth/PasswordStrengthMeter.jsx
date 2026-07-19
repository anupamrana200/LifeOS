import { Check } from 'lucide-react';
import { PASSWORD_REQUIREMENTS } from '@/constants';
import { cn, getPasswordRequirements, getPasswordStrength } from '@/utils';

const strengthColors = ['bg-danger', 'bg-warning', 'bg-success'];

export const PasswordStrengthMeter = ({ password }) => {
  const requirements = getPasswordRequirements(password);
  const { label, score } = getPasswordStrength(password);

  return (
    <div aria-live="polite" className="space-y-2">
      {password && (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((segment) => (
            <span className={cn('h-1 flex-1 rounded-pill bg-border', segment <= score && strengthColors[score - 1])} key={segment} />
          ))}
          <span className="ml-1 text-xs text-content-secondary">{label}</span>
        </div>
      )}
      <ul className="grid gap-1 sm:grid-cols-2">
        {PASSWORD_REQUIREMENTS.map(({ key, label: requirementLabel }) => (
          <li className={cn('flex items-center gap-1.5 text-xs', requirements[key] ? 'text-success' : 'text-content-muted')} key={key}>
            <Check aria-hidden="true" size={13} />
            {requirementLabel}
          </li>
        ))}
      </ul>
    </div>
  );
};
