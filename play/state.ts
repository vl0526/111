import { GAME_WIDTH, PLAYER_WIDTH } from './constants';
import { Egg, Particle, FloatingText, GameStats } from '../types';

// This function produces a fresh game state for a new session.  We use
// plain JavaScript objects rather than React state here because the
// rendering logic interacts with these values directly on each frame.  The
// `useRef` hook in React code stores a reference to an instance of this
// state.
export const getInitialGameState = () => ({
  score: 0,
  lives: 3,
  playerX: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
  /**
   * Vertical offset of the player relative to the bottom of the screen.
   * A value of 0 means the player stands on the ground, negative
   * values lift the player upwards.  The offset is clamped to
   * `-MAX_JUMP_HEIGHT` defined in constants.ts.  This property is
   * updated in the GameCanvas rather than the logic module because
   * vertical movement is purely a rendering and collision concern.
   */
  playerY: 0,
  /**
   * Current vertical velocity of the player used for smooth ascent and
   * descent.  Managed by the renderer; logic modules do not modify
   * this field.
   */
  playerVY: 0,
  eggs: [] as Egg[],
  particles: [] as Particle[],
  floatingTexts: [] as FloatingText[],
  inputState: {
    left: false,
    right: false,
    /**
     * Horizontal touch coordinate used by mobile devices.  When not
     * null the player will move towards this x coordinate.  See
     * GameCanvas for touch handling.
     */
    touchX: null as number | null,
    /**
     * Whether the jump control is currently held down.  This flag is
     * set by keyboard or button handlers and influences vertical
     * movement of the player.  When the dragonfly pet is active the
     * player can maintain altitude by holding this down.
     */
    jump: false,
  },
  lastTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
  spawnTimer: 0,
  screenShake: { magnitude: 0, duration: 0 },
  comboCounter: 0,
  comboActive: false,
  comboTimer: 0,
  slowMoTimer: 0,
  scoreMultiplier: 1,
  multiplierTimer: 0,
  gameStats: { goldenEggs: 0, bombsHit: 0, rottenHit: 0, starsCaught: 0 } as GameStats,
  /**
   * Currently owned pet.  `null` indicates no pet.  When the kitsune
   * pet is active the player receives a shield every 20 seconds; when
   * the dragonfly pet is active the player can hover by holding
   * the jump button.  See GameCanvas for behaviour.
   */
  pet: null as null | 'kitsune' | 'dragonfly',
  /**
   * Whether a temporary shield is currently active.  When true the
   * player cannot lose lives from rotten eggs, bombs or misses.
   */
  shieldActive: false,
  /**
   * Remaining time in milliseconds before the current shield expires.
   */
  shieldTimer: 0,
  /**
   * Timestamp in milliseconds at which the next automatic shield
   * activation for the kitsune pet will occur.  When this time
   * passes a shield is granted and `shieldTimer` is set.  Updated in
   * GameCanvas.
   */
  nextShieldActivation: 0,
  /**
   * Current weather condition.  Affects both rendering and game logic.
   */
  weather: 'sunny' as 'sunny' | 'rain' | 'snow' | 'wind' | 'lightning' | 'fog',
  /**
   * Remaining time in milliseconds before the weather changes again.
   */
  weatherTimer: 0,
});

// The type of the game state returned by `getInitialGameState`.  Exporting
// this alias avoids having to repeat the return type across modules.
export type GameStateRef = ReturnType<typeof getInitialGameState>;
