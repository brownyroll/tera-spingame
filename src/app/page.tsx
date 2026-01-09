"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FiPlay } from "react-icons/fi";
import SpinWheel from "@/components/SpinWheel";
import { showItemWonAlert, showWinnerAlert, showErrorAlert } from "@/lib/swal";

interface Item {
  id: number;
  name: string;
  color: string;
  image: string | null;
  isActive: boolean;
}

interface Participant {
  id: number;
  name: string;
  isActive: boolean;
}

type WheelMode = "items" | "participants";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [wheelMode, setWheelMode] = useState<WheelMode>("items");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [itemsRes, participantsRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/participants"),
      ]);

      const itemsData = await itemsRes.json();
      const participantsData = await participantsRes.json();

      setItems(itemsData.filter((item: Item) => item.isActive));
      setParticipants(participantsData.filter((p: Participant) => p.isActive));
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorAlert("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get current wheel items based on mode
  const currentWheelItems =
    wheelMode === "items"
      ? items.map((item) => ({ label: item.name, backgroundColor: item.color }))
      : participants.map((p) => ({ label: p.name }));

  const currentDataArray = wheelMode === "items" ? items : participants;

  // Handle spin button click
  const handleSpin = () => {
    if (currentDataArray.length === 0) {
      showErrorAlert(
        wheelMode === "items"
          ? "กรุณาเพิ่มของรางวัลก่อน"
          : "กรุณาเพิ่มผู้เข้าร่วมก่อน",
      );
      return;
    }

    // Random target index
    const randomIndex = Math.floor(Math.random() * currentDataArray.length);
    setTargetIndex(randomIndex);
    setSpinning(true);
  };

  // Handle spin end
  const handleSpinEnd = async (winningIndex: number) => {
    setSpinning(false);
    setTargetIndex(-1);

    if (wheelMode === "items") {
      // Item wheel finished
      const wonItem = items[winningIndex];
      setSelectedItem(wonItem);

      const result = await showItemWonAlert(wonItem.name, wonItem.image);

      if (result.isConfirmed) {
        // Switch to participants wheel
        setWheelMode("participants");
      }
    } else {
      // Participant wheel finished
      const winner = participants[winningIndex];

      if (selectedItem) {
        // Save to history
        try {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: selectedItem.id,
              participantId: winner.id,
            }),
          });
        } catch (error) {
          console.error("Error saving history:", error);
        }

        // Show winner alert
        await showWinnerAlert(
          winner.name,
          selectedItem.name,
          selectedItem.image,
        );

        // Reset state
        setSelectedItem(null);
        setWheelMode("items");
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {wheelMode === "items" ? "สุ่มของรางวัล" : "สุ่มผู้โชคดี"}
      </Typography>

      {selectedItem && wheelMode === "participants" && (
        <Alert severity="info" sx={{ mb: 2, justifyContent: "center" }}>
          ของรางวัล: <strong>{selectedItem.name}</strong>
        </Alert>
      )}

      {currentDataArray.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary" gutterBottom>
            {wheelMode === "items"
              ? "🎁🎁🎁 ของรางวัลหมดแล้ว ขอบคุณที่ร่วมสนุกน๊าา Happy New Year 2026 🎉🎉🎉"
              : "ผู้เข้าร่วมหมดแล้ว"}
          </Typography>
          <Button
            variant="contained"
            href={wheelMode === "items" ? "/items" : "/participants"}
            sx={{ mt: 2 }}
          >
            {wheelMode === "items" ? "เพิ่มของรางวัล" : "เพิ่มผู้เข้าร่วม"}
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 550,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SpinWheel
              items={currentWheelItems}
              onSpinEnd={handleSpinEnd}
              spinning={spinning}
              targetIndex={targetIndex}
            />
          </Paper>

          <Button
            variant="contained"
            size="large"
            color={wheelMode === "items" ? "primary" : "secondary"}
            startIcon={<FiPlay />}
            onClick={handleSpin}
            disabled={spinning || currentDataArray.length === 0}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              borderRadius: 3,
            }}
          >
            {spinning
              ? "กำลังหมุน..."
              : wheelMode === "items"
                ? "สุ่มของรางวัล"
                : "สุ่มผู้โชคดี"}
          </Button>

          {wheelMode === "participants" && (
            <Button
              variant="outlined"
              onClick={() => {
                setWheelMode("items");
                setSelectedItem(null);
              }}
            >
              เริ่มใหม่
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
}
