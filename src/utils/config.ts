export const GAME_CONFIG = {
  // Game mechanics
  NUMBER_OF_COMBINATIONS: 3,
  MAX_SPIN_LENGTH: 9,
  DELAY_SECONDS_AFTER_WINNING: 5,
  
  // Animation durations
  DOOR_ANIMATION_DURATION: 1,
  HANDLE_ROTATION_DURATION: 0.5,
  HANDLE_SPIN_DURATION: 1,
  GLITTER_DURATION: 1,
  GLITTER_PAUSE_DURATION: 0.1,
  HANDLE_FADE_DURATION: 0.3,
  
  // Visual effects
  HANDLE_ROTATION_AMOUNT: Math.PI / 3,
  HANDLE_SPIN_ROTATIONS: 4,
  
  // Timer
  TIMER_UPDATE_INTERVAL: 100
} as const;

export enum Direction {
  CLOCKWISE = "clockwise",
  COUNTERCLOCKWISE = "counterclockwise"
}

export enum GameStatus {
  NORMAL = "normal",
  WIN = "win",
  FAILURE = "failure"
} 