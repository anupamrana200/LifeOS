import { Breadcrumbs } from './Breadcrumbs';

export const PageHeader = ({ actions, breadcrumbs, description, subtitle, title }) => {
  const supportingText = subtitle || description;
  if (!title && !supportingText && !breadcrumbs && !actions) return null;

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-layout sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbs} />
        {title && <h1 className="text-2xl font-semibold text-content-primary">{title}</h1>}
        {supportingText && <p className="text-sm text-content-secondary">{supportingText}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
};
