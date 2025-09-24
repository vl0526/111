# Project Overview

This repository contains a modularised version of the original game.  The goal of
the restructuring is to organise the codebase into well‑defined domains and to
prepare the project for future feature development such as daily missions,
dynamic weather, pets, skills, PvP and an in–game economy.  Each top‑level
directory isolates a particular concern and exposes a small contract via a
`README.md` describing the local API.  This makes it clear what each module
is responsible for and how the pieces fit together.

```text
restructured_game/
├── admin/      – Admin interface and supporting scripts.
├── assets/     – All static assets (images, audio, 3D models, animations).
├── network/    – Supabase and network related code.
├── play/       – Core gameplay logic and scenes.
├── settings/   – Settings screens and utilities.
├── ui/         – Reusable UI components (buttons, menus, HUD, etc.).
├── services/   – Shared utilities such as sound and SFX.
├── types/      – Shared TypeScript types and interfaces.
├── .env.example – Example environment file for secrets.
├── package.json – Project metadata and dependencies.
└── tsconfig.json – TypeScript configuration.
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set your
   [Supabase](https://supabase.com/) project URL and anonymous key as well as
   your Gemini API key.

3. Run the development server:

```bash
npm run dev
```

## Design Goals

* **Separation of Concerns:** Each directory is scoped to a clear domain.  The
  `play` folder handles game state and logic, `ui` contains purely visual
  components, `network` encapsulates all communication with Supabase and other
  backends, `admin` holds privileged tooling and screens, and `settings`
  isolates user preferences and help screens.
* **Server Authority:** All random item drops, currency modifications and
  leaderboard updates are processed server‑side to prevent client cheating.
* **Ephemeral Data:** Match data and detailed logs are not persisted after a
  session ends to save storage.  Only minimal metadata (winner, score,
  duration) is retained when necessary.
* **Extensibility:** The skeleton code provides hooks for adding features such
  as dynamic weather, pets, skills and PvP.  These are implemented as
  TypeScript interfaces and empty modules that can be filled in as the game
  evolves.

Consult the `README.md` in each module for more details about its API and
current implementation status.
