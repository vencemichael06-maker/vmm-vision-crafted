export const HAND_FRAME_COUNT = 48;

export function progressToHandFrame(progress: number) {
  return Math.round(Math.min(Math.max(progress, 0), 1) * (HAND_FRAME_COUNT - 1));
}
