"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Wheel } from "spin-wheel";
import { Box } from "@mui/material";

interface WheelItem {
  label: string;
  backgroundColor?: string;
  labelColor?: string;
}

interface SpinWheelProps {
  items: WheelItem[];
  onSpinEnd?: (winningIndex: number) => void;
  spinning?: boolean;
  targetIndex?: number;
}

// Color palette for wheel segments
const defaultColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8B500",
  "#00CED1",
];

export default function SpinWheel({
  items,
  onSpinEnd,
  spinning,
  targetIndex,
}: SpinWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<Wheel | null>(null);
  const [savedRotation, setSavedRotation] = useState<number>(0);
  const hasSpunRef = useRef<boolean>(false);

  // Prepare items with colors
  const preparedItems = items.map((item, index) => ({
    label: item.label,
    backgroundColor:
      item.backgroundColor || defaultColors[index % defaultColors.length],
    labelColor: item.labelColor || "#ffffff",
  }));

  const handleSpinEnd = useCallback(
    (event: { currentIndex: number }) => {
      // Save the current rotation when spin ends
      if (wheelRef.current) {
        setSavedRotation(wheelRef.current.rotation);
        hasSpunRef.current = true;
      }
      if (onSpinEnd) {
        onSpinEnd(event.currentIndex);
      }
    },
    [onSpinEnd],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || preparedItems.length === 0) return;

    // Clear previous wheel
    if (wheelRef.current) {
      container.innerHTML = "";
      wheelRef.current = null;
    }

    const wheel = new Wheel(container, {
      items: preparedItems,
      itemLabelFontSizeMax: 40,
      itemLabelRadius: 0.85,
      itemLabelRadiusMax: 0.2,
      itemLabelRotation: 0,
      itemLabelAlign: "right",
      itemLabelColors: ["#fff"],
      itemLabelBaselineOffset: -0.07,
      itemLabelFont: "bold, Prompt, sans-serif",
      itemBackgroundColors: preparedItems.map((item) => item.backgroundColor),
      rotationSpeedMax: 500,
      rotationResistance: -70,
      lineWidth: 2,
      lineColor: "#fff",
      borderWidth: 3,
      borderColor: "#333",
      pointerAngle: 90,
      isInteractive: false,
      radius: 0.95,
      rotation: hasSpunRef.current ? savedRotation : 0, // Use saved rotation if available
    });

    wheel.onRest = handleSpinEnd;
    wheelRef.current = wheel;

    // Restore rotation after wheel is created
    if (hasSpunRef.current) {
      wheel.rotation = savedRotation;
    }

    return () => {
      container.innerHTML = "";
      wheelRef.current = null;
    };
  }, [preparedItems, handleSpinEnd, savedRotation]);

  useEffect(() => {
    if (
      spinning &&
      wheelRef.current &&
      targetIndex !== undefined &&
      targetIndex >= 0
    ) {
      const duration = 4000 + Math.random() * 1000; // 4-5 seconds
      const revolutions = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
      wheelRef.current.spinToItem(targetIndex, duration, true, revolutions, 1);
    }
  }, [spinning, targetIndex]);

  if (items.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "50%",
          aspectRatio: "1",
        }}
      >
        <Box sx={{ textAlign: "center", color: "text.secondary" }}>
          ไม่พบรายการสุ่มสปิน
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        aspectRatio: "1",
        margin: "0 auto",
      }}
    >
      {/* Pointer indicator */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: -15,
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "20px solid transparent",
          borderBottom: "20px solid transparent",
          borderRight: "30px solid #333",
          zIndex: 10,
          filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
        }}
      />
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}
