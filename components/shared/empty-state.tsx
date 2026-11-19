import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed bg-surface-1 p-8 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
          {icon}
        </span>

        <h2 className="mt-4 text-xl font-semibold">{title}</h2>

        <p className="mt-2 leading-6 text-muted-foreground">
          {description}
        </p>

        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </section>
  );
}