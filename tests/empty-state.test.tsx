import { render, screen } from "@testing-library/react";
import { BookOpenText } from "lucide-react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("explains the empty condition", () => {
    render(
      <EmptyState
        icon={
          <BookOpenText
            className="size-6"
            aria-hidden="true"
          />
        }
        title="No repertoires"
        description="Create the first one."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No repertoires" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Create the first one.")).toBeInTheDocument();
  });
});