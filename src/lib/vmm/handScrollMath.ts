export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function frameIndexFromProgress(progress: number, frameCount: number): number {
  if (!Number.isFinite(frameCount) || frameCount <= 1) return 0;
  return Math.round(clampProgress(progress) * (frameCount - 1));
}

export function normalizedScrollProgress(
  trackTop: number,
  scrollableDistance: number,
): number {
  if (!Number.isFinite(scrollableDistance) || scrollableDistance <= 0) return 0;
  return clampProgress(-trackTop / scrollableDistance);
}

export function crossedForwardThresholds(
  previous: number,
  current: number,
  thresholds: readonly number[],
): number[] {
  if (current <= previous) return [];
  return thresholds.filter((threshold) => threshold > previous && threshold <= current);
}
