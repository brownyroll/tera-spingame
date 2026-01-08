'use client';

import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.7,
        size: 3 + Math.random() * 8,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {snowflakes.map((flake) => (
        <Box
          key={flake.id}
          sx={{
            position: 'absolute',
            top: '-10px',
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear infinite`,
            boxShadow: '0 0 5px rgba(255,255,255,0.5)',
            '@keyframes snowfall': {
              '0%': {
                transform: 'translateY(-10px) rotate(0deg)',
              },
              '100%': {
                transform: 'translateY(100vh) rotate(360deg)',
              },
            },
          }}
        />
      ))}
    </Box>
  );
}
