# Network Module

All interactions with Supabase and third party services live in this module.  By
encapsulating network calls in one place we avoid scattering backend logic
throughout the UI and gameplay code.  This also makes it trivial to swap
providers or stub out services during development.

## supabaseClient.ts

Exports a single instance of the Supabase client created from the
environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY`.  Do not
instantiate new clients elsewhere in the app; import this one instead.

```ts
import supabase from '../network/supabaseClient';
const { data, error } = await supabase.from('users').select('*');
```

## api.ts

This file exports helper functions for common backend tasks:

* `fetchLeaderboard(limit?)` – query the `leaderboard` table and return
  the top records.  The table is expected to contain one row per user
  with fields `{ userId, displayName, topScore, updatedAt }`.  If you
  store separate entries for each game session you should create a
  view that exposes the highest score per user.

* `submitScore(userId, displayName, score)` – call the `upsert_leaderboard`
  stored procedure to insert or update a leaderboard entry atomically.
  You will need to create this procedure in your Supabase project.  It
  should compare the supplied score with the existing record and
  update only if the new score is higher.

* `openChest(userId)` – invoke the `open_chest` edge function.  The
  server returns an object like `{ item: 'pet_kitsune' }` or `{ item:
  null }`.  Implement the weighting and reward logic in your edge
  function to enforce fairness and prevent client manipulation.

* `finalizeMatch(matchId, winnerId, score, duration)` – call a
  stored procedure that writes minimal match metadata and removes
  detailed logs from the realtime database.  This is essential for
  keeping storage usage low.

* `validateUsername(username)` – call a moderation function to ensure
  that user supplied names do not contain profanity or disallowed
  content.  The function should return `{ valid: boolean }`.

Feel free to extend this file with additional helpers such as
`generateDailyMissions()` (via Gemini), `updateInventory()` or
`purchaseItem()` as your game grows.
