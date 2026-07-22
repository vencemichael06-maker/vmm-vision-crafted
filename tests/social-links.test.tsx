import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SocialLinks } from "@/components/vmm/SocialLinks";

describe("social profile controls", () => {
  it("renders Facebook and LinkedIn links when verified URLs are configured", () => {
    render(
      <SocialLinks
        facebookUrl="https://example.test/facebook"
        linkedinUrl="https://example.test/linkedin"
      />,
    );

    expect(screen.getByRole("link", { name: "Visit Facebook profile" })).toHaveAttribute(
      "href",
      "https://example.test/facebook",
    );
    expect(screen.getByRole("link", { name: "Visit LinkedIn profile" })).toHaveAttribute(
      "href",
      "https://example.test/linkedin",
    );
    expect(screen.queryByText(/behance/i)).not.toBeInTheDocument();
  });

  it("keeps missing profiles visible but unavailable without creating links", () => {
    render(<SocialLinks facebookUrl={null} linkedinUrl={null} />);

    expect(screen.getByRole("button", { name: "Facebook profile unavailable" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "LinkedIn profile unavailable" })).toBeDisabled();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
