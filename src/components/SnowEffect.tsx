"use client";

import Snowfall from "react-snowfall";

export default function SnowEffect() {
  return (
    <Snowfall
      color="white"
      snowflakeCount={100}
      radius={[1, 5]}
      speed={[0.5, 3.0]}
      wind={[-0.5, 2.0]}
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
