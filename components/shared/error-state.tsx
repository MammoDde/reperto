import { CircleAlert } from "lucide-react";
export function ErrorState({ title = "Something went wrong", description = "Try again. If the problem continues, return to the dashboard.", action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return <section role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6"><CircleAlert className="size-6 text-destructive" aria-hidden="true" /><h2 className="mt-3 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>{action ? <div className="mt-4">{action}</div> : null}</section>;
}
