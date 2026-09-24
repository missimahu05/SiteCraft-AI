/**
 * Motion System Centralized Tokens
 * Standard UI Motion & Visual QA
 */

export const MOTION_DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
} as const;

export const MOTION_EASINGS = {
  standard: [0.2, 0.0, 0, 1.0],      // Décélération naturelle
  expressive: [0.4, 0.0, 0.2, 1.0],    // Accélération / décélération marquée
  springTight: { type: 'spring', stiffness: 400, damping: 30 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },
} as const;
