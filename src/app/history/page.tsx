"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { FiSearch, FiGift, FiUser, FiClock, FiDownload } from "react-icons/fi";
import { showErrorAlert, showSuccessAlert } from "@/lib/swal";

interface HistoryItem {
  id: number;
  itemId: number;
  participantId: number;
  wonAt: string;
  item: {
    id: number;
    name: string;
    color: string;
  };
  participant: {
    id: number;
    name: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      showErrorAlert("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      showErrorAlert("Notting Data Please Random data");
      return;
    }
    const BOM = "\uFEFF";
    const headers = ["ลำดับ เรียงจากสุ่มล่าสุด", "รายชื่อผู้ได้รับรางวัล", "รางวัลที่ได้รับ", "วันเวลา"];
    const csvContent = [
      headers.join(","),
      ...filteredHistory.map((h, index) => {
        const row = [
          index + 1,
          `"${h.participant.name}"`,
          `"${h.item.name}"`,
          `"${formatDate(h.wonAt)}"`,
        ];
        return row.join(",");
      }),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);

    link.setAttribute("href", url);
    link.setAttribute("download", `ประวัติการสุ่ม_${timestamp}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccessAlert("ส่งออกข้อมูลสำเร็จ");
  };

  const filteredHistory = history.filter(
    (h) =>
      h.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.participant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">ประวัติการสุ่ม</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<FiDownload />}
          onClick={exportToCSV}
          disabled={filteredHistory.length === 0}
        >
          ส่งออก CSV
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          placeholder="ค้นหาชื่อของรางวัลหรือผู้ได้รับ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FiUser /> ผู้โชคดี
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FiGift /> ของรางวัล
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FiClock /> วันเวลา
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchTerm
                      ? "ไม่พบข้อมูลที่ค้นหา"
                      : "ยังไม่มีประวัติการสุ่ม"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((h, index) => (
                <TableRow key={h.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={h.participant.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: h.item.color,
                          border: "1px solid #ddd",
                        }}
                      />
                      <Chip
                        label={h.item.name}
                        sx={{
                          backgroundColor: h.item.color,
                          color: "#fff",
                        }}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(h.wonAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredHistory.length > 0 && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Typography variant="body2" color="text.secondary">
            ทั้งหมด {filteredHistory.length} รายการ
          </Typography>
        </Box>
      )}
    </Container>
  );
}
