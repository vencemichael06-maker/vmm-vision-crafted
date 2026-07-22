import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

class MatchMediaMock implements MediaQueryList {
  matches = false;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null = null;

  constructor(media: string) {
    this.media = media;
  }

  addEventListener() {}
  removeEventListener() {}
  addListener() {}
  removeListener() {}
  dispatchEvent() {
    return true;
  }
}

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: (query: string) => new MatchMediaMock(query),
});

class IntersectionObserverMock implements IntersectionObserver {
  root = null;
  rootMargin = "0px";
  thresholds = [0];
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  value: IntersectionObserverMock,
});
