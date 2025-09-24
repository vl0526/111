# UI Module

Reusable user interface components live in this directory.  These
components are presentational only and should not contain game
business logic.  Where appropriate they accept callbacks and props
that allow the parent to control their behaviour.

## Available Components

* **`DoodleButton`** – A stylised button with the blueprint colour
  palette.  Use this for all interactive actions such as starting the
  game, submitting forms or navigating between screens.
* **`MusicToggleButton`** – A small circular button that toggles
  background music on and off.  Typically rendered in the top right
  corner of the screen.
* **`NameInputScreen`** – Captures the player’s nickname before
  entering the game.  Validates input and prevents empty submissions.
* **`StartMenu`** – The main menu shown after entering a name.  It
  displays the high score, fetches a daily mission from Gemini and
  provides buttons to start a game, view the leaderboard or read the
  instructions.
* **`GameOverScreen`** – Displays the final score and high score,
  generates a quirky performance review via Gemini and offers a
  restart button.
* **`PauseMenu`** – Overlay shown when the game is paused.  Lets the
  player resume, restart or return to the main menu.
* **`LeaderboardScreen`** – Presents the current leaderboard using
  medal colours for the top three positions.  Automatically adapts to
  an empty list.

When adding new components (e.g. shop, hotbar, PvP overlay) create a
separate file for each and export it from this module.  Write a
sentence in this README describing its purpose and expected props.
