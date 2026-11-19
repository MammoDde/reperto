import { BookOpenText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opening library"
        title="Repertoires"
        description="Create and organize the opening choices you want to remember."
      />

      <EmptyState
        icon={
          <BookOpenText
            className="size-6"
            aria-hidden="true"
          />
        }
        title="Phase 0 foundation"
        description="This page is intentionally a polished placeholder. Repertoire creation arrives in its dedicated implementation phase."
      />
    </div>
  );
}