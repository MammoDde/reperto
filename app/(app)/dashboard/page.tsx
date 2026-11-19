import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
export default function Page() { return <div className="space-y-8"><PageHeader eyebrow="Overview" title="Dashboard" description="Your learning workspace will bring due reviews, repertoire activity and progress together here." /><EmptyState icon={<Construction className="size-6" aria-hidden="true" />} title="Phase 0 foundation" description="This page is intentionally a polished placeholder. Product logic arrives in its dedicated implementation phase." /></div>; }
