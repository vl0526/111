// Fundamental constants for the gameplay.  These values control
// dimensions, speeds, scoring and other parameters.  They are
// intentionally kept in a single module so they can be tuned
// independently of the rest of the code.

// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Colours and style
export const PRIMARY_COLOR = '#0048ab'; // Blueprint Blue
export const BACKGROUND_COLOR = '#f4f1de'; // Blueprint Paper
export const ROTTEN_EGG_COLOR = '#d92626'; // Warning Red
export const GOLDEN_EGG_COLOR = '#ffb833'; // Accent Yellow
export const BOMB_COLOR = '#333333'; // Dark Grey
export const HEART_COLOR = '#e53e3e'; // Red for heart
export const CLOCK_COLOR = '#3b82f6'; // Blue for clock
export const STAR_COLOR = '#ffde0a'; // Bright yellow for star
export const FRENZY_COLOR = '#ff4500'; // OrangeRed for chilli
export const LINE_WIDTH = 5;

// Player settings
export const PLAYER_WIDTH = 80;
export const PLAYER_HEIGHT = 100;
export const PLAYER_SPEED = 600; // pixels per second
export const BASKET_OFFSET_Y = 60;
export const BASKET_WIDTH = 90;
export const BASKET_HEIGHT = 20;

// Egg settings
export const EGG_WIDTH = 30;
export const EGG_HEIGHT = 40;
export const BOMB_RADIUS = 20;
export const HEART_WIDTH = 35;
export const HEART_HEIGHT = 35;
export const CLOCK_RADIUS = 20;
export const STAR_WIDTH = 35;
export const STAR_HEIGHT = 35;
export const FRENZY_WIDTH = 35;
export const FRENZY_HEIGHT = 45;
export const INITIAL_EGG_SPEED = 100;
export const INITIAL_SPAWN_RATE = 1.2; // seconds
export const MAX_DIFFICULTY_SCORE = 500;

// Power‑up settings
export const SLOW_MOTION_DURATION = 5000; // 5 seconds in ms
export const SLOW_MOTION_FACTOR = 0.5;
export const MULTIPLIER_DURATION = 7000; // 7 seconds in ms
export const SCORE_MULTIPLIER = 2;
export const FRENZY_DURATION = 5000; // 5 seconds in ms

// Chest settings
/**
 * Width and height of the chest item.  The chest is slightly larger
 * than a regular egg to make it stand out.  When caught the chest
 * triggers an asynchronous call to the server to determine whether
 * the player receives a pet or nothing.
 */
export const CHEST_WIDTH = 40;
export const CHEST_HEIGHT = 40;

// Spawn probabilities
/**
 * Probability that a newly spawned item will be a chest.  A value of
 * 0.20 means a 20% chance.  Adjust this to tune how often pets are
 * granted.  The remaining probability budget is shared among the
 * existing items in spawnItem.
 */
export const CHEST_SPAWN_PROBABILITY = 0.20;

// Jump & flight settings
/**
 * Maximum vertical offset when jumping or flying.  Negative values
 * represent upward movement relative to the ground.  This value
 * determines how high the player can jump or hover.
 */
export const MAX_JUMP_HEIGHT = 120;

/**
 * Vertical movement speed in pixels per second when ascending or
 * descending.  Higher values result in snappier movement.  When
 * holding the jump button while owning the dragonfly pet the
 * ascent speed is increased by `FLY_MULTIPLIER`.
 */
export const JUMP_SPEED = 300;

/**
 * Multiplier applied to the jump speed when the player is flying
 * using the dragonfly pet.  Hovering is easier with a pet, so the
 * player rises more quickly and can maintain altitude while holding
 * the jump control.
 */
export const FLY_MULTIPLIER = 1.5;

// Scoring
export const SCORE_NORMAL = 1;
export const SCORE_GOLDEN = 5;

// Combo
export const COMBO_THRESHOLD = 5;
export const COMBO_DURATION = 5000; // 5 seconds in ms

// Leaderboard
export const LEADERBOARD_SIZE = 5;
