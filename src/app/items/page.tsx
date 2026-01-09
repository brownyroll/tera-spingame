"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
} from "@mui/material";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { showConfirmDelete, showErrorAlert } from "@/lib/swal";

interface Item {
  id: number;
  name: string;
  color: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
}

interface FormData {
  name: string;
  color: string;
  image: string | null;
  imageFile: File | null;
}

const defaultFormData: FormData = {
  name: "",
  color: "#3498db",
  image: null,
  imageFile: null,
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      showErrorAlert("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        color: item.color,
        image: item.image,
        imageFile: null,
      });
    } else {
      setEditingItem(null);
      setFormData(defaultFormData);
    }
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showErrorAlert("กรุณาเลือกไฟล์ png, jpeg หรือ gif เท่านั้น");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showErrorAlert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image: reader.result as string,
        imageFile: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imageFile: null,
    });
  };

  const handleRandomColor = () => {
    // Generate random bright color
    const colors = [
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
      "#FF69B4",
      "#FFD700",
      "#32CD32",
      "#FF8C00",
      "#9370DB",
      "#20B2AA",
      "#FF1493",
      "#00BFFF",
      "#FF4500",
      "#DA70D6",
      "#48D1CC",
      "#FF6347",
      "#7B68EE",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setFormData({ ...formData, color: randomColor });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showErrorAlert("กรุณากรอกชื่อของรางวัล");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingItem ? `/api/items/${editingItem.id}` : "/api/items";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
          image: formData.image || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      handleCloseDialog();
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      showErrorAlert("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: Item) => {
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      fetchItems();
    } catch (error) {
      console.error("Error toggling item:", error);
      showErrorAlert("ไม่สามารถอัพเดทข้อมูลได้");
    }
  };

  const handleDelete = async (item: Item) => {
    const result = await showConfirmDelete(item.name);
    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/items/${item.id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      showErrorAlert("ไม่สามารถลบข้อมูลได้");
    }
  };

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
        <Typography variant="h4">จัดการของรางวัล</Typography>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          onClick={() => handleOpenDialog()}
        >
          เพิ่มของรางวัล
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>สี</TableCell>
              <TableCell>ชื่อของรางวัล</TableCell>
              <TableCell align="center">สถานะ</TableCell>
              <TableCell align="center">เปิด/ปิด</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    ยังไม่มีของรางวัล
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        backgroundColor: item.color,
                        border: "1px solid #ddd",
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      color={item.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={item.isActive}
                      onChange={() => handleToggleActive(item)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? "แก้ไขของรางวัล" : "เพิ่มของรางวัล"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="ชื่อของรางวัล"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
              autoFocus
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                label="สี"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                sx={{ width: 100 }}
                InputProps={{
                  sx: { height: 56 },
                }}
              />
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  backgroundColor: formData.color,
                  border: "1px solid #ddd",
                }}
              />
              <Button
                variant="outlined"
                startIcon={<FiRefreshCw />}
                onClick={handleRandomColor}
                sx={{ height: 56 }}
              >
                สุ่มสี
              </Button>
            </Box>

            {/* Image Upload Section */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                รูปภาพของรางวัล (ไม่บังคับ)
              </Typography>

              {formData.image ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                      p: 1,
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    ลบรูปภาพ
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" component="label" fullWidth>
                  เลือกรูปภาพ (PNG, JPEG, GIF)
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleImageChange}
                  />
                </Button>
              )}

              <Typography variant="caption" color="text.secondary">
                * หากไม่เลือกรูปภาพ จะใช้รูป /img/ani-merry.gif แทน
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
