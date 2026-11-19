import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
export default function Page() { return <div className="space-y-8"><PageHeader eyebrow="Preferences" title="Settings" description="Manage appearance, board behavior and account preferences." /><EmptyState icon={<Construction className="size-6" aria-hidden="true" />} title="Phase 0 foundation" description="This page is intentionally a polished placeholder. Product logic arrives in its dedicated implementation phase." /></div>; }
