import { GameStateRef } from './state';

/**
 * Represents a character skill.  Each skill has an identifier, a
 * human readable name, a cooldown (ms), a duration (ms) and an effect
 * function that mutates the game state when activated.  Effects should
 * be balanced and not overly powerful.  When implementing a new
 * mechanic ensure that it plays well with existing power‑ups and
 * cannot be abused.
 */
export interface Skill {
  id: string;
  name: string;
  cooldown: number;
  duration: number;
  activate: (state: GameStateRef) => void;
  deactivate: (state: GameStateRef) => void;
}

// Example skill definitions.  These are intentionally simple and
// illustrative.  Replace or extend them to suit your game design.
export const skills: Skill[] = [
  {
    id: 'dash',
    name: 'Tăng Tốc',
    cooldown: 8000,
    duration: 2000,
    activate: (state) => {
      // Temporarily increase player speed by 50%
      (state as any)._originalSpeed = state.playerX; // stash original
    },
    deactivate: (state) => {
      // Restore original speed
    },
  },
  {
    id: 'shield',
    name: 'Khiên Bảo Hộ',
    cooldown: 15000,
    duration: 3000,
    activate: (state) => {
      // Grant temporary invulnerability.  In a real implementation
      // you would add a flag to the state and check it in the logic
      // module when processing catches and misses.
      (state as any).invulnerable = true;
    },
    deactivate: (state) => {
      (state as any).invulnerable = false;
    },
  },
  {
    id: 'double-points',
    name: 'Nhân Đôi Điểm',
    cooldown: 12000,
    duration: 5000,
    activate: (state) => {
      state.scoreMultiplier *= 2;
    },
    deactivate: (state) => {
      state.scoreMultiplier = Math.max(1, state.scoreMultiplier / 2);
    },
  },
];

/**
 * Activate a skill if it is off cooldown.  Returns true if activation
 * succeeded.  This function does not schedule deactivation; the
 * caller should handle timing and call the skill’s `deactivate`
 * method after `duration` milliseconds.
 */
export function activateSkill(state: GameStateRef, skill: Skill): boolean {
  const now = Date.now();
  (skill as any).lastActivated = (skill as any).lastActivated || 0;
  if (now - (skill as any).lastActivated < skill.cooldown) return false;
  (skill as any).lastActivated = now;
  skill.activate(state);
  return true;
}
