# Settings Module

All screens and utilities related to user settings, help and guidance
belong in this module.  Keeping help content separate from gameplay
code prevents unintentional coupling and makes it easier to evolve
presentation independently of mechanics.

Currently the module exposes a single component:

* `InstructionsModal.tsx` – describes the game controls, item types
  and objectives.  It is designed to be displayed over the game
  canvas and uses blueprint styling consistent with the rest of the
  interface.

Future additions might include:

* A settings screen where players can toggle audio, adjust controls or
  switch graphics quality.
* A credits modal listing contributors and open source licenses.
* A tutorial that walks new users through a sample session.

Keep each new screen in its own file and document its API in this
README.
