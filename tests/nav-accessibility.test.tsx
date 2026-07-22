import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Nav } from "@/components/vmm/Nav";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRouterState: () => "/",
}));

describe("navigation dialog", () => {
  it("is named, takes initial focus, closes with Escape, and restores opener focus", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const opener = screen.getByRole("button", { name: "Open menu" });

    await user.click(opener);

    expect(screen.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Site navigation" })).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
