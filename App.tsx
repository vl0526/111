import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameStats, LeaderboardEntry } from './types';
import NameInputScreen from './ui/NameInputScreen';
import StartMenu from './ui/StartMenu';
import InstructionsModal from './settings/InstructionsModal';
import LeaderboardScreen from './ui/LeaderboardScreen';
import GameOverScreen from './ui/GameOverScreen';
import PauseMenu from './ui/PauseMenu';
import GameCanvas from './play/GameCanvas';
import MusicPlayer from './services/MusicPlayer';
import MusicToggleButton from './ui/MusicToggleButton';
import Hotbar from './ui/Hotbar';
import { fetchLeaderboard, submitScore } from './network/api';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.NAME_INPUT);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  // Simple inventory state for the hotbar.  In a complete
  // implementation this would be updated when the player collects
  // consumables like magnets or clocks.  Each slot holds an item key.
  const [inventory, setInventory] = useState<(string | undefined)[]>([]);
  const musicPlayer = useRef(new MusicPlayer());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({ goldenEggs: 0, bombsHit: 0, rottenHit: 0, starsCaught: 0 });
  // On mount read cached values and fetch remote leaderboard
  useEffect(() => {
    try {
      const storedName = localStorage.getItem('player_name');
      const storedHighScore = localStorage.getItem('high_score');
      if (storedName) {
        setPlayerName(storedName);
        setGameState(GameState.START_MENU);
      }
      if (storedHighScore) {
        setHighScore(parseInt(storedHighScore, 10));
      }
    } catch (error) {
      console.error('Failed to read from localStorage', error);
    }
    const loadLeaderboard = async () => {
      const records = await fetchLeaderboard();
      setLeaderboard(records.map((r) => ({ name: r.displayName, score: r.topScore })));
    };
    loadLeaderboard();
  }, []);
  // Handlers
  const handleNameSubmit = useCallback((name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('player_name', name);
    } catch (error) {
      console.error('Failed to save name to localStorage', error);
    }
    setGameState(GameState.START_MENU);
  }, []);
  const handleToggleMusic = useCallback(() => {
    musicPlayer.current.toggle();
    setIsMusicPlaying((prev) => !prev);
  }, []);
  const handleStartGame = useCallback(() => {
    setScore(0);
    setGameStats({ goldenEggs: 0, bombsHit: 0, rottenHit: 0, starsCaught: 0 });
    setGameState(GameState.PLAYING);
  }, []);
  const handleShowInstructions = useCallback(() => setGameState(GameState.INSTRUCTIONS), []);
  const handleShowLeaderboard = useCallback(() => setGameState(GameState.LEADERBOARD), []);
  const handleBackToMenu = useCallback(() => setGameState(GameState.START_MENU), []);
  const handlePause = useCallback(() => {
    if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
  }, [gameState]);
  const handleResume = useCallback(() => setGameState(GameState.PLAYING), []);
  const handleGameOver = useCallback(
    async (finalScore: number, stats: GameStats) => {
      setScore(finalScore);
      setGameStats(stats);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        try {
          localStorage.setItem('high_score', finalScore.toString());
        } catch (error) {
          console.error('Failed to save high score', error);
        }
      }
      // Update leaderboard locally and remotely
      const newLeaderboard = [...leaderboard, { name: playerName || 'Player', score: finalScore }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      setLeaderboard(newLeaderboard);
      // Submit to Supabase asynchronously
      if (playerName) {
        const userId = playerName; // In a real app use auth uid
        await submitScore(userId, playerName, finalScore);
      }
      setGameState(GameState.GAME_OVER);
    },
    [highScore, playerName, leaderboard],
  );
  // Render state based UI
  const renderContent = () => {
    switch (gameState) {
      case GameState.NAME_INPUT:
        return <NameInputScreen onNameSubmit={handleNameSubmit} />;
      case GameState.START_MENU:
        return (
          <StartMenu
            onStart={handleStartGame}
            onShowInstructions={handleShowInstructions}
            onShowLeaderboard={handleShowLeaderboard}
            playerName={playerName || ''}
            highScore={highScore}
          />
        );
      case GameState.INSTRUCTIONS:
        return <InstructionsModal onBack={handleBackToMenu} />;
      case GameState.LEADERBOARD:
        return <LeaderboardScreen scores={leaderboard} onBack={handleBackToMenu} />;
      case GameState.PLAYING:
      case GameState.PAUSED:
        return (
          <>
            <GameCanvas
              onGameOver={handleGameOver}
              onPause={handlePause}
              isPaused={gameState === GameState.PAUSED}
              playerId={playerName || ''}
            />
            {/* Hotbar overlay for consumable items.  Currently unused
                but reserved for future features like magnets or
                slow‑down clocks. */}
            <Hotbar
              items={inventory}
              onUse={(idx) => {
                const item = inventory[idx];
                if (!item) return;
                // Example: handle magnet item usage here
                alert(`Item ${item} used! (not implemented)`);
                // Remove from inventory
                setInventory((inv) => {
                  const copy = [...inv];
                  copy[idx] = undefined;
                  return copy;
                });
              }}
            />
            {gameState === GameState.PAUSED && <PauseMenu onResume={handleResume} onRestart={handleStartGame} onBack={handleBackToMenu} />}
          </>
        );
      case GameState.GAME_OVER:
        return (
          <GameOverScreen
            score={score}
            highScore={highScore}
            onRestart={handleStartGame}
            stats={gameStats}
            playerName={playerName || ''}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="bg-transparent text-[#0048ab] min-h-screen flex items-center justify-center font-sans">
      <div className="relative w-full h-full max-w-screen-lg max-h-screen-md aspect-[4/3]">
        {gameState !== GameState.NAME_INPUT && (
          <MusicToggleButton isMusicPlaying={isMusicPlaying} onToggle={handleToggleMusic} />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
