import { Particle } from '../types';

/**
 * Render all particles onto the provided 2D context.  Particles are
 * transient visual effects used for hits and power‑ups.  They are
 * decoupled from the core game logic and can be extended with
 * additional properties without affecting the simulation.
 */
export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
) => {
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
};
