import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroPersonGlitch } from "@/components/vmm/HeroPersonGlitch";

class VisibleIntersectionObserver implements IntersectionObserver {
  root = null;
  rootMargin = "0px";
  thresholds = [0];

  constructor(private readonly callback: IntersectionObserverCallback) {}

  disconnect() {}
  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
  }
  takeRecords() {
    return [];
  }
  unobserve() {}
}

describe("hero person glitch lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) =>
      window.setTimeout(() => callback(16), 16),
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((handle) =>
      window.clearTimeout(handle),
    );
    vi.spyOn(Math, "random").mockReturnValue(0);
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: VisibleIntersectionObserver,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("keeps the person visible and waits for the image before starting the glitch", () => {
    const { container } = render(<HeroPersonGlitch />);
    const root = container.querySelector(".vmm-hpg");
    const base = container.querySelector<HTMLImageElement>(".vmm-hpg__base");

    expect(root).toHaveClass("vmm-hpg--init");
    expect(getComputedStyle(base!).opacity).toBe("1");

    act(() => vi.advanceTimersByTime(1_000));
    expect(root).toHaveClass("vmm-hpg--init");

    fireEvent.load(base!);
    act(() => vi.advanceTimersByTime(16));
    expect(root).toHaveClass("vmm-hpg--run");
  });

  it("mounts layered glitch visuals for restrained recurring pulses", () => {
    const { container } = render(<HeroPersonGlitch />);
    const root = container.querySelector(".vmm-hpg");
    const base = container.querySelector<HTMLImageElement>(".vmm-hpg__base");

    fireEvent.load(base!);
    act(() => vi.advanceTimersByTime(966));
    expect(root).toHaveClass("vmm-hpg--done");
    expect(
      container.querySelectorAll(".vmm-hpg__ghost,.vmm-hpg__r,.vmm-hpg__c,.vmm-hpg__slice"),
    ).toHaveLength(0);

    act(() => vi.advanceTimersByTime(10_000));
    expect(root).toHaveClass("vmm-hpg--pulse");
    expect(
      container.querySelectorAll(".vmm-hpg__ghost,.vmm-hpg__r,.vmm-hpg__c,.vmm-hpg__slice"),
    ).toHaveLength(6);
  });
});
