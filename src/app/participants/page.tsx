'use client';

import { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { showConfirmDelete, showErrorAlert } from '@/lib/swal';

interface Participant {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [name, setName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch('/api/participants');
      const data = await res.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      showErrorAlert('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleOpenDialog = (participant?: Participant) => {
    if (participant) {
      setEditingParticipant(participant);
      setName(participant.name);
    } else {
      setEditingParticipant(null);
      setName('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingParticipant(null);
    setName('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showErrorAlert('กรุณากรอกชื่อผู้เข้าร่วม');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingParticipant
        ? `/api/participants/${editingParticipant.id}`
        : '/api/participants';
      const method = editingParticipant ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error('Failed to save');

      handleCloseDialog();
      fetchParticipants();
    } catch (error) {
      console.error('Error saving participant:', error);
      showErrorAlert('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async () => {
    const names = bulkNames
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) {
      showErrorAlert('กรุณากรอกรายชื่อ');
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(
        names.map((n) =>
          fetch('/api/participants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: n }),
          })
        )
      );

      setBulkDialogOpen(false);
      setBulkNames('');
      fetchParticipants();
    } catch (error) {
      console.error('Error saving participants:', error);
      showErrorAlert('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (participant: Participant) => {
    try {
      await fetch(`/api/participants/${participant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !participant.isActive }),
      });
      fetchParticipants();
    } catch (error) {
      console.error('Error toggling participant:', error);
      showErrorAlert('ไม่สามารถอัพเดทข้อมูลได้');
    }
  };

  const handleDelete = async (participant: Participant) => {
    const result = await showConfirmDelete(participant.name);
    if (!result.isConfirmed) return;

    try {
      await fetch(`/api/participants/${participant.id}`, { method: 'DELETE' });
      fetchParticipants();
    } catch (error) {
      console.error('Error deleting participant:', error);
      showErrorAlert('ไม่สามารถลบข้อมูลได้');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">จัดการผู้เข้าร่วม</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FiUsers />}
            onClick={() => setBulkDialogOpen(true)}
          >
            เพิ่มหลายคน
          </Button>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มผู้เข้าร่วม
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>ชื่อผู้เข้าร่วม</TableCell>
              <TableCell align="center">สถานะ</TableCell>
              <TableCell align="center">เปิด/ปิด</TableCell>
              <TableCell align="center">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">ยังไม่มีผู้เข้าร่วม</Typography>
                </TableCell>
              </TableRow>
            ) : (
              participants.map((participant, index) => (
                <TableRow key={participant.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={participant.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      color={participant.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={participant.isActive}
                      onChange={() => handleToggleActive(participant)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(participant)}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(participant)}
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingParticipant ? 'แก้ไขผู้เข้าร่วม' : 'เพิ่มผู้เข้าร่วม'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="ชื่อผู้เข้าร่วม"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Add Dialog */}
      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>เพิ่มผู้เข้าร่วมหลายคน</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            กรอกรายชื่อ 1 ชื่อต่อ 1 บรรทัด
          </Typography>
          <TextField
            label="รายชื่อ"
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            fullWidth
            multiline
            rows={10}
            placeholder={`ชื่อคนที่ 1\nชื่อคนที่ 2\nชื่อคนที่ 3`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>ยกเลิก</Button>
          <Button
            variant="contained"
            onClick={handleBulkSubmit}
            disabled={submitting}
          >
            {submitting ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
