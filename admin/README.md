# Admin Module

The `admin` module contains user interface and scripts reserved for
administrators.  These tools allow privileged users to manage the game
state, moderate player accounts and perform maintenance tasks.  Access
controls are enforced via Supabase Auth custom claims; only users with
an `admin` claim may call the endpoints exposed here.

## AdminPanel.tsx

This React component is a stub demonstrating how an admin interface
could be constructed.  It currently fetches the leaderboard and
displays a table of users with placeholder buttons to ban or reset
accounts.  In a real implementation you would:

* Query the `users` table from Supabase to list all player accounts.
* Provide actions to ban/unban users by setting a flag in their
  profile document or deleting their auth record.
* Reset a user’s coin balance or unlock items via server side
  functions that run as the service role.
* Audit all admin actions in an `admin_logs` table with timestamps
  and the acting administrator’s ID.

Access to the admin panel should be restricted on both the client
and server.  On the client side, check the user’s claim before
rendering the page.  On the server side, validate the JWT claims in
any RPCs or edge functions triggered by admin actions.
