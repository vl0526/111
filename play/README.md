# Play Module

The `play` module encapsulates all core gameplay functionality.  It
contains the simulation state, the logic that evolves the state on
each frame and the renderer that draws the current state to a canvas.
By isolating these concerns we can unit test the logic separately
from the rendering and more easily extend the game with new mechanics
like skills, pets or weather.

## Files

* **`constants.ts`** – Centralised configuration for dimensions,
  colours, speeds, scoring and power‑ups.  Adjust values here to
  rebalance the game.
* **`state.ts`** – Defines the shape of the game state and provides
  a helper to produce a fresh state.  The state is a plain object
  rather than React state so it can be mutated within the animation
  loop.
* **`logic.ts`** – Implements the pure simulation logic.  Given a
  state and a time delta it spawns eggs, updates positions,
  applies power‑ups and returns a list of events (catches, misses
  and score additions).  It does not perform any drawing or side
  effects.
* **`effects.ts`** – Manages visual effects like floating text,
  particles and screen shake.  These effects are updated each frame
  independently of the core logic.
* **`drawing.ts`** – Contains helper functions for drawing to a
  canvas.  Currently only draws particles; extend this as you add
  more complex rendering.
* **`GameCanvas.tsx`** – React component that drives the animation
  loop.  It orchestrates the logic updates, handles input and draws
  a simplified representation of the state.  This component can be
  replaced with a more sophisticated renderer (e.g. Three.js) without
  changing the underlying logic.

## Extending the Game

To add new mechanics (e.g. character skills, pets or weather), start
by extending the state type in `state.ts` with any new properties.  Then
update `logic.ts` to modify these properties based on timers or player
input.  Use the returned events array to trigger side effects such
as playing sounds or spawning particles.  Avoid mutating React state
directly inside the logic; instead, expose state changes via events
and let the React component decide how to respond.

For networked features like PvP or leaderboards, coordinate the
simulation with Supabase via the functions defined in the `network`
module.  For example, update `logic.ts` to emit a `MATCH_FINISHED`
event when one player’s lives drop to zero and call
`finalizeMatch()` from the React component when it receives this event.
