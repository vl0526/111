import supabase from './supabaseClient';

export interface LeaderboardRecord {
  userId: string;
  displayName: string;
  topScore: number;
  updatedAt?: string;
}

/**
 * Fetch the current leaderboard from Supabase.  Only distinct users are
 * returned, ordered by their top score in descending order.  Records
 * include the user identifier, display name and score.  The caller is
 * responsible for handling any errors.
 */
export async function fetchLeaderboard(limit = 10): Promise<LeaderboardRecord[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('userId, displayName, topScore, updatedAt')
    .order('topScore', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data ?? [];
}

/**
 * Submit a new score for the given user.  If the score beats the
 * existing record the row is updated; otherwise it is left unchanged.
 * This function runs inside a database transaction on the server via
 * a Supabase stored procedure called `upsert_leaderboard`.  You must
 * define this function in your Supabase project.  See the module
 * README for details.
 */
export async function submitScore(userId: string, displayName: string, score: number): Promise<void> {
  const { error } = await supabase.rpc('upsert_leaderboard', { p_user_id: userId, p_display_name: displayName, p_score: score });
  if (error) {
    console.error('Error submitting score:', error);
  }
}

/**
 * Open a chest for the current user.  The randomness is performed on
 * the server via the `open_chest` edge function to prevent client
 * manipulation.  The function returns the item key (e.g. `pet_kitsune`)
 * or `null` if no reward is granted.
 */
export async function openChest(userId: string): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('open_chest', { body: { userId } });
  if (error) {
    console.error('Error opening chest:', error);
    return null;
  }
  return data?.item ?? null;
}

/**
 * Finalise a completed match and record minimal metadata.  This RPC
 * removes detailed match state to save storage.  You must implement
 * `finalize_match` in your Supabase project.
 */
export async function finalizeMatch(matchId: string, winnerId: string, score: number, duration: number): Promise<void> {
  const { error } = await supabase.rpc('finalize_match', { p_match_id: matchId, p_winner_id: winnerId, p_score: score, p_duration: duration });
  if (error) {
    console.error('Error finalising match:', error);
  }
}

/**
 * Validate a proposed username by calling a moderation function backed
 * by Gemini.  This example calls a `validate_username` edge function
 * which should return a boolean indicating whether the name is
 * permissible.  This prevents profane or offensive names from being
 * stored in the database.
 */
export async function validateUsername(username: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke('validate_username', { body: { username } });
  if (error) {
    console.error('Error validating username:', error);
    return false;
  }
  return data?.valid ?? false;
}
