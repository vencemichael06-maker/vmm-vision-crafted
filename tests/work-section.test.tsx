import type { ComponentProps, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkSection } from "@/sections/WorkSection";

vi.mock("@/lib/vmm/useGsap", () => ({ useGsap: () => undefined }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    ...props
  }: ComponentProps<"a"> & {
    children: ReactNode;
    to: string;
    params?: { slug: string };
  }) => (
    <a href={params ? `/work/${params.slug}` : to} {...props}>
      {children}
    </a>
  ),
}));

describe("Work project disclosure", () => {
  it("shows four curated projects before expansion", () => {
    render(<WorkSection />);

    expect(screen.getAllByTestId("work-project")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /view more projects/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("reveals and collapses all seven projects", async () => {
    const user = userEvent.setup();
    render(<WorkSection />);

    const disclosure = screen.getByRole("button", { name: /view more projects/i });
    await user.click(disclosure);

    expect(screen.getAllByTestId("work-project")).toHaveLength(7);
    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    expect(disclosure).toHaveAccessibleName(/show fewer projects/i);

    await user.click(disclosure);
    expect(screen.getAllByTestId("work-project")).toHaveLength(4);
    expect(disclosure).toHaveFocus();
  });

  it("shows every matching automation project when filtered", async () => {
    const user = userEvent.setup();
    render(<WorkSection />);

    await user.click(screen.getByRole("button", { name: /AI & Automation/i }));

    expect(screen.getAllByTestId("work-project")).toHaveLength(4);
    expect(screen.queryByRole("button", { name: /view more projects/i })).not.toBeInTheDocument();
  });
});

