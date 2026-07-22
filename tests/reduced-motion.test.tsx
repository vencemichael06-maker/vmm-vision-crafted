import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HandRevealFrameSequence } from "@/components/vmm/HandRevealFrameSequence";

describe("reduced motion hand sequence", () => {
  it("renders the final open-hand poster without starting the canvas sequence", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => true,
      }),
    });
    const sectionRef = createRef<HTMLElement>();

    const { container } = render(<HandRevealFrameSequence sectionRef={sectionRef} />);

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/assets/vmm/about/hand-open-transparent.png",
    );
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});
