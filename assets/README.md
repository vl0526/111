# Assets

This folder contains all static assets used by the game.  Keeping assets in a
dedicated module makes it obvious where to look for models, textures and
sounds.  It also means that build tools like Vite can be configured to
optimise asset delivery without touching the game logic.

```
assets/
  update-data/     – Images, music and pet skins from the provided ZIP archive.
```

## update‑data

The `update-data` directory is copied from the `data-skin.zip` archive
supplied with this assignment.  It contains item sprites, character skins,
pet skins and the background music (`Music-background.mp3`).  When adding
new assets place them here and reference them in code via relative imports,
for example:

```ts
import magnet from '../assets/update-data/Item-skin/magnet.png';
```

Note that large binary assets are served from Supabase Storage in a
production environment.  During development it is convenient to bundle
these files locally.
