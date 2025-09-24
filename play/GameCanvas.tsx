import React, { useRef, useEffect, useCallback, useState } from 'react';
import { getInitialGameState, GameStateRef } from './state';
import { updateGameLogic } from './logic';
import { updateEffects, addFloatingText, createParticles, triggerScreenShake } from './effects';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PRIMARY_COLOR,
  ROTTEN_EGG_COLOR,
  GOLDEN_EGG_COLOR,
  BOMB_COLOR,
  HEART_COLOR,
  CLOCK_COLOR,
  STAR_COLOR,
  MAX_JUMP_HEIGHT,
  JUMP_SPEED,
  FLY_MULTIPLIER,
} from './constants';
import { EggType } from '../types';
import Sfx from '../services/Sfx';
import { openChest } from '../network/api';

interface GameCanvasProps {
  onGameOver: (score: number, stats: { goldenEggs: number; bombsHit: number; rottenHit: number; starsCaught: number; }) => void;
  onPause: () => void;
  isPaused: boolean;
  /**
   * Identifier of the current user.  This value is forwarded to the
   * openChest RPC when a chest is caught in order to determine the
   * reward.  In a real implementation this would be the user’s
   * unique id from Supabase Auth rather than their display name.
   */
  playerId: string;
}

/**
 * A simplified canvas based game renderer.  This component manages the
 * animation loop, updates the simulation via the logic module and draws
 * basic shapes for the player and falling items.  It is intentionally
 * lightweight to serve as a starting point for more advanced
 * implementations like character skins, pets or weather effects.
 */
const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver, onPause, isPaused, playerId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameStateRef>(getInitialGameState());
  const sfx = useRef(new Sfx());
  const animationFrameId = useRef<number | null>(null);
  // Weather particle state (raindrops, snowflakes etc.).  We store this
  // outside the main game state because it is purely a rendering
  // concern and does not affect gameplay logic.  When the weather
  // changes we reinitialise this structure.
  const weatherParticlesRef = useRef<{ type: string; particles: any[] }>({ type: '', particles: [] });
  // Lightning flash intensity used during lightning weather.  When
  // positive a white overlay is drawn on top of the scene for a
  // fraction of a second.
  const [lightningFlash, setLightningFlash] = useState(0);


  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        stateRef.current.inputState.left = true;
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        stateRef.current.inputState.right = true;
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        // Arrow up or space triggers jump/fly on desktop
        stateRef.current.inputState.jump = true;
      } else if (e.key.toLowerCase() === 'p') {
        onPause();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        stateRef.current.inputState.left = false;
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        stateRef.current.inputState.right = false;
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        stateRef.current.inputState.jump = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPause]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      const logicDt = isPaused ? 0 : dt;
      // Update game state
      const events = updateGameLogic(stateRef.current, dt, logicDt);
      // Handle events (play sounds, spawn particles, etc.)
      events.forEach(ev => {
        switch (ev.type) {
          case 'CATCH_NORMAL':
            sfx.current.playCatch();
            addFloatingText(stateRef.current, '+1', ev.position.x, ev.position.y);
            break;
          case 'CATCH_GOLDEN':
            sfx.current.playGoldenCatch();
            addFloatingText(stateRef.current, '+5', ev.position.x, ev.position.y);
            break;
          case 'CATCH_ROTTEN':
            sfx.current.playRottenCatch();
            triggerScreenShake(stateRef.current, 5, 300);
            break;
          case 'CATCH_BOMB':
            sfx.current.playBomb();
            triggerScreenShake(stateRef.current, 8, 500);
            break;
          case 'CATCH_HEART':
            sfx.current.playHeartCatch();
            addFloatingText(stateRef.current, '+❤', ev.position.x, ev.position.y);
            break;
          case 'CATCH_CLOCK':
            sfx.current.playClockCatch();
            addFloatingText(stateRef.current, 'Slow!', ev.position.x, ev.position.y);
            break;
          case 'CATCH_STAR':
            sfx.current.playStarCatch();
            addFloatingText(stateRef.current, 'x2', ev.position.x, ev.position.y);
            break;
      case 'CATCH_CHEST':
        sfx.current.playStarCatch();
        addFloatingText(stateRef.current, '?', ev.position.x, ev.position.y);
        // Call the server to open the chest.  This returns a promise
        // resolving with the item key (pet_kitsune, pet_dragonfly or null).
        void (async () => {
          const reward = await openChest(playerId);
          if (reward === 'pet_kitsune') {
            stateRef.current.pet = 'kitsune';
            stateRef.current.nextShieldActivation = performance.now() + 20000;
            addFloatingText(stateRef.current, 'Kitsune!', ev.position.x, ev.position.y);
          } else if (reward === 'pet_dragonfly') {
            stateRef.current.pet = 'dragonfly';
            addFloatingText(stateRef.current, 'Dragonfly!', ev.position.x, ev.position.y);
          } else {
            addFloatingText(stateRef.current, 'Chúc bạn may mắn lần sau', ev.position.x, ev.position.y);
          }
        })();
        break;
          case 'MISS':
            sfx.current.playMiss();
            break;
          case 'ADD_SCORE':
            addFloatingText(stateRef.current, `+${ev.amount}`, ev.position.x, ev.position.y);
            break;
        }
      });
      updateEffects(stateRef.current, dt);

      // 1. Update vertical movement for jump/fly.  We do this here
      // rather than in the logic module because vertical movement
      // exclusively affects rendering and collision detection and
      // interacts with input state.  Negative values of playerY
      // correspond to upward movement.
      const maxHeight = -MAX_JUMP_HEIGHT;
      const speed = JUMP_SPEED * (stateRef.current.pet === 'dragonfly' ? FLY_MULTIPLIER : 1);
      if (stateRef.current.inputState.jump) {
        stateRef.current.playerY = Math.max(stateRef.current.playerY - speed * dt, maxHeight);
      } else {
        stateRef.current.playerY = Math.min(stateRef.current.playerY + speed * dt, 0);
      }

      // 2. Update kitsune shield timers.  When the kitsune pet is
      // owned the player gains a shield every 20 seconds lasting 3
      // seconds.  The nextShieldActivation timestamp is initialised
      // when the pet is granted (see chest handling).  When shield
      // expires or is inactive for long enough we schedule the next
      // activation.
      if (stateRef.current.pet === 'kitsune') {
        if (stateRef.current.shieldActive) {
          stateRef.current.shieldTimer -= dt * 1000;
          if (stateRef.current.shieldTimer <= 0) {
            stateRef.current.shieldActive = false;
            stateRef.current.shieldTimer = 0;
          }
        }
        const nowMs = performance.now();
        if (!stateRef.current.shieldActive && nowMs >= stateRef.current.nextShieldActivation) {
          stateRef.current.shieldActive = true;
          stateRef.current.shieldTimer = 3000;
          stateRef.current.nextShieldActivation = nowMs + 20000;
          addFloatingText(stateRef.current, 'Shield!', stateRef.current.playerX + PLAYER_WIDTH / 2, GAME_HEIGHT + stateRef.current.playerY - PLAYER_HEIGHT);
        }
      }

      // 3. Update weather timer and particles.  The timer counts down
      // in milliseconds.  When it reaches zero we randomly select
      // another weather condition and reset the timer to a random
      // duration between 15 and 30 seconds.  Weather effects do not
      // interrupt the game and are purely cosmetic apart from simple
      // modifications applied in the logic module.
      stateRef.current.weatherTimer -= dt * 1000;
      if (stateRef.current.weatherTimer <= 0) {
        const weatherOptions: typeof stateRef.current.weather[] = ['sunny', 'rain', 'snow', 'wind', 'lightning', 'fog'];
        // Avoid repeating the same weather consecutively
        let nextWeather: typeof stateRef.current.weather;
        do {
          nextWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        } while (nextWeather === stateRef.current.weather);
        stateRef.current.weather = nextWeather;
        stateRef.current.weatherTimer = 15000 + Math.random() * 15000;
        // Initialise particles for the new weather
        weatherParticlesRef.current = { type: nextWeather, particles: [] };
        // Precreate some particles for snow/rain
        if (nextWeather === 'rain') {
          const drops = [];
          for (let i = 0; i < 50; i++) {
            drops.push({ x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, length: 10 + Math.random() * 10, speed: 300 + Math.random() * 200 });
          }
          weatherParticlesRef.current.particles = drops;
        } else if (nextWeather === 'snow') {
          const flakes = [];
          for (let i = 0; i < 40; i++) {
            flakes.push({ x: Math.random() * GAME_WIDTH, y: Math.random() * GAME_HEIGHT, radius: 2 + Math.random() * 3, speedY: 30 + Math.random() * 30, drift: (Math.random() - 0.5) * 20 });
          }
          weatherParticlesRef.current.particles = flakes;
        }
      }

      // 4. Update weather particles positions each frame
      if (stateRef.current.weather === 'rain') {
        weatherParticlesRef.current.particles.forEach((drop: any) => {
          drop.y += drop.speed * dt;
          if (drop.y > GAME_HEIGHT) {
            drop.y = -10;
            drop.x = Math.random() * GAME_WIDTH;
          }
        });
      } else if (stateRef.current.weather === 'snow') {
        weatherParticlesRef.current.particles.forEach((flake: any) => {
          flake.y += flake.speedY * dt;
          flake.x += flake.drift * dt;
          if (flake.y > GAME_HEIGHT) {
            flake.y = -10;
            flake.x = Math.random() * GAME_WIDTH;
          }
          if (flake.x < 0 || flake.x > GAME_WIDTH) {
            flake.x = (flake.x + GAME_WIDTH) % GAME_WIDTH;
          }
        });
      }

      // 5. Occasionally trigger lightning flashes during lightning weather.
      if (stateRef.current.weather === 'lightning' && Math.random() < 0.02) {
        setLightningFlash(1);
        // Also shake the screen slightly and play a sound effect if available
        triggerScreenShake(stateRef.current, 5, 300);
        sfx.current.playBomb();
      }

      // Decay the lightning flash intensity
      if (lightningFlash > 0) {
        setLightningFlash(Math.max(0, lightningFlash - dt * 4));
      }
      // Render scene
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // Draw background
      ctx.fillStyle = 'rgba(244, 241, 222, 1)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // Draw eggs
      stateRef.current.eggs.forEach(item => {
        switch (item.type) {
          case EggType.NORMAL:
            ctx.strokeStyle = PRIMARY_COLOR;
            ctx.beginPath();
            ctx.ellipse(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case EggType.GOLDEN:
            ctx.strokeStyle = GOLDEN_EGG_COLOR;
            ctx.shadowColor = GOLDEN_EGG_COLOR;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
            break;
          case EggType.ROTTEN:
            ctx.strokeStyle = ROTTEN_EGG_COLOR;
            ctx.beginPath();
            ctx.ellipse(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case EggType.BOMB:
            ctx.fillStyle = BOMB_COLOR;
            ctx.beginPath();
            ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case EggType.HEART:
            ctx.strokeStyle = HEART_COLOR;
            ctx.beginPath();
            ctx.rect(item.x, item.y, item.width, item.height);
            ctx.stroke();
            break;
          case EggType.CLOCK:
            ctx.strokeStyle = CLOCK_COLOR;
            ctx.beginPath();
            ctx.rect(item.x, item.y, item.width, item.height);
            ctx.stroke();
            break;
          case EggType.STAR:
            ctx.strokeStyle = STAR_COLOR;
            ctx.beginPath();
            ctx.rect(item.x, item.y, item.width, item.height);
            ctx.stroke();
            break;
        case EggType.CHEST:
          // Draw chest as a simple orange square for now.  You could
          // replace this with an image loaded from assets when
          // integrating real graphics.
          ctx.fillStyle = '#cc7722';
          ctx.fillRect(item.x, item.y, item.width, item.height);
          ctx.strokeStyle = '#8b4513';
          ctx.strokeRect(item.x, item.y, item.width, item.height);
          break;
        }
      });
      // Draw player as simple rectangle and basket
      const px = stateRef.current.playerX;
      // Apply vertical offset to the player's y position
      const py = GAME_HEIGHT - PLAYER_HEIGHT + stateRef.current.playerY;
      ctx.fillStyle = PRIMARY_COLOR;
      ctx.fillRect(px, py, PLAYER_WIDTH, PLAYER_HEIGHT);
      // Draw basket
      const basketWidth = 90;
      const basketHeight = 20;
      const basketX = px + (PLAYER_WIDTH - basketWidth) / 2;
      const basketY = py + 60;
      ctx.strokeStyle = stateRef.current.shieldActive ? '#29b6f6' : PRIMARY_COLOR;
      ctx.lineWidth = stateRef.current.shieldActive ? 3 : 1;
      ctx.strokeRect(basketX, basketY, basketWidth, basketHeight);
      ctx.lineWidth = 1;
      // Draw pet icon above player if owned
      if (stateRef.current.pet) {
        const iconSize = 30;
        const iconX = px + PLAYER_WIDTH + 10;
        const iconY = py + 10;
        ctx.fillStyle = stateRef.current.pet === 'kitsune' ? '#f59e0b' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Draw floating texts
      stateRef.current.floatingTexts.forEach(t => {
        ctx.save();
        ctx.globalAlpha = t.opacity;
        ctx.fillStyle = PRIMARY_COLOR;
        ctx.font = `bold 20px 'Kalam', cursive`;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });
      // Screen shake effect (simple translation)
      if (stateRef.current.screenShake.magnitude > 0) {
        const shakeX = (Math.random() - 0.5) * stateRef.current.screenShake.magnitude;
        const shakeY = (Math.random() - 0.5) * stateRef.current.screenShake.magnitude;
        ctx.translate(shakeX, shakeY);
      }

      // Draw weather effects overlay on top of the scene
      if (stateRef.current.weather === 'rain') {
        ctx.strokeStyle = '#3b82f6aa';
        ctx.lineWidth = 2;
        weatherParticlesRef.current.particles.forEach((drop: any) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.length);
          ctx.stroke();
        });
      } else if (stateRef.current.weather === 'snow') {
        ctx.fillStyle = '#ffffffcc';
        weatherParticlesRef.current.particles.forEach((flake: any) => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (stateRef.current.weather === 'fog') {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }
      // Overlay a white flash during lightning strikes
      if (lightningFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${lightningFlash})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }
      // Check for game over
      if (stateRef.current.lives <= 0) {
        onGameOver(stateRef.current.score, stateRef.current.gameStats);
      }
      animationFrameId.current = requestAnimationFrame(loop);
    };
    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPaused, onGameOver]);

  return (
    <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="border-2 border-[#0048ab] rounded-lg" />
      {/* Mobile jump/fly button.  Appears on top of the canvas and allows
          tapping/holding to jump or fly.  On desktop players can
          use the keyboard (space/arrow up) instead. */}
      <button
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-[#0048ab] text-white text-xl flex items-center justify-center opacity-80"
        onPointerDown={() => {
          stateRef.current.inputState.jump = true;
        }}
        onPointerUp={() => {
          stateRef.current.inputState.jump = false;
        }}
        onPointerLeave={() => {
          stateRef.current.inputState.jump = false;
        }}
      >
        ⬆︎
      </button>
    </div>
  );
};

export default GameCanvas;
