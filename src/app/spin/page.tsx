"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import { FiPlay } from "react-icons/fi";
import SpinWheel from "@/components/SpinWheel";
import { showWinnerAlert, showErrorAlert, showItemWonAlert } from "@/lib/swal";

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

export default function DualSpinPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // Spinning states
  const [itemSpinning, setItemSpinning] = useState(false);
  const [participantSpinning, setParticipantSpinning] = useState(false);
  const [itemTargetIndex, setItemTargetIndex] = useState<number>(-1);
  const [participantTargetIndex, setParticipantTargetIndex] =
    useState<number>(-1);

  // Selected results
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

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

  // Get wheel items
  const itemWheelItems = items.map((item) => ({
    label: item.name,
    backgroundColor: item.color,
  }));

  const participantWheelItems = participants.map((p) => ({
    label: p.name,
  }));

  // Handle main spin button
  const handleStartSpin = () => {
    if (items.length === 0) {
      showErrorAlert("กรุณาเพิ่มของรางวัลก่อน");
      return;
    }
    if (participants.length === 0) {
      showErrorAlert("กรุณาเพิ่มผู้เข้าร่วมก่อน");
      return;
    }

    // Reset previous results
    setSelectedItem(null);
    setSelectedParticipant(null);

    // Start spinning item wheel first
    const randomItemIndex = Math.floor(Math.random() * items.length);
    setItemTargetIndex(randomItemIndex);
    setItemSpinning(true);
  };

  // Handle item wheel spin end
  const handleItemSpinEnd = async (winningIndex: number) => {
    setItemSpinning(false);
    setItemTargetIndex(-1);

    const wonItem = items[winningIndex];
    setSelectedItem(wonItem);

    // Show item won alert
    await showItemWonAlert(wonItem.name, wonItem.image);

    // Start spinning participant wheel immediately after alert
    const randomParticipantIndex = Math.floor(
      Math.random() * participants.length,
    );
    setParticipantTargetIndex(randomParticipantIndex);
    setParticipantSpinning(true);
  };

  // Handle participant wheel spin end
  const handleParticipantSpinEnd = async (winningIndex: number) => {
    setParticipantSpinning(false);
    setParticipantTargetIndex(-1);

    const winner = participants[winningIndex];
    setSelectedParticipant(winner);

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
      await showWinnerAlert(winner.name, selectedItem.name, selectedItem.image);
    }
  };

  const isSpinning = itemSpinning || participantSpinning;
  const canSpin = items.length > 0 && participants.length > 0 && !isSpinning;

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        สุ่มรางวัลและผู้โชคดี
      </Typography>

      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Terabyte<sup>+</sup> วงล้อมหาสนุก
      </Typography>

      {items.length === 0 || participants.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary" gutterBottom>
            {items.length === 0
              ? "🎁🎁🎁 ของรางวัลหมดแล้ว ขอบคุณที่ร่วมสนุกน๊าา Happy New Year 2026 🎉🎉🎉"
              : "ผู้เข้าร่วมหมดแล้ว"}
          </Typography>
          <Box
            sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}
          >
            {items.length === 0 && (
              <Button variant="contained" href="/items">
                เพิ่มของรางวัล
              </Button>
            )}
            {participants.length === 0 && (
              <Button variant="contained" href="/participants">
                เพิ่มผู้เข้าร่วม
              </Button>
            )}
          </Box>
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
          <Grid container spacing={4} justifyContent="center">
            {/* Item Wheel - Left */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  textAlign="center"
                  gutterBottom
                  color="primary"
                >
                  วงล้อรางวัล 
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <SpinWheel
                    items={itemWheelItems}
                    onSpinEnd={handleItemSpinEnd}
                    spinning={itemSpinning}
                    targetIndex={itemTargetIndex}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Participant Wheel - Right */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  textAlign="center"
                  gutterBottom
                  color="secondary"
                >
                  วงล้อผู้โชคดี
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <SpinWheel
                    items={participantWheelItems}
                    onSpinEnd={handleParticipantSpinEnd}
                    spinning={participantSpinning}
                    targetIndex={participantTargetIndex}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<FiPlay />}
            onClick={handleStartSpin}
            disabled={!canSpin}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              borderRadius: 3,
            }}
          >
            {isSpinning
              ? itemSpinning
                ? "กำลังสุ่มรางวัล..."
                : "กำลังสุ่มผู้โชคดี..."
              : "เริ่มสุ่ม"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
