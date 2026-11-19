import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "@/components/shared/page-header";
describe("PageHeader", () => { it("renders its semantic heading and description", () => { render(<PageHeader title="Repertoires" description="Opening library" />); expect(screen.getByRole("heading", { name: "Repertoires", level: 1 })).toBeInTheDocument(); expect(screen.getByText("Opening library")).toBeInTheDocument(); }); });
