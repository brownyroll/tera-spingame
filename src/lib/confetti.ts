'use client';

import confetti from 'canvas-confetti';

// Christmas colors
const christmasColors = ['#ff0000', '#00ff00', '#ffffff', '#ffd700', '#ff6b6b'];

// Side cannons effect - fireworks from both sides
export const fireConfettiSideCannons = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds

  const frame = () => {
    if (Date.now() > end) return;

    // Left side
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: christmasColors,
    });

    // Right side
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: christmasColors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

// Fireworks burst effect
export const fireConfettiFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Random fireworks
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: christmasColors,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: christmasColors,
    });
  }, 250);
};

// Snow falling effect
export const fireSnowEffect = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    if (Date.now() > animationEnd) return;

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 200,
      origin: {
        x: Math.random(),
        y: -0.1,
      },
      colors: ['#ffffff', '#e0f7fa'],
      shapes: ['circle'],
      gravity: 0.3,
      scalar: 1.2,
      drift: Math.random() - 0.5,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

// Big celebration - combine effects
export const fireCelebration = () => {
  // Initial burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: christmasColors,
  });

  // Side cannons
  setTimeout(() => {
    fireConfettiSideCannons();
  }, 300);
};
