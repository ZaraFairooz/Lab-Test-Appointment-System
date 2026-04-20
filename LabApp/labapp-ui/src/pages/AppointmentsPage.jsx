import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { API_BASE, jsonHeaders } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AppointmentsPage() {
  const { token, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState("");
  const [testType, setTestType] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  const loadPatients = useCallback(async () => {
    if (!token) {
      setPatients([]);
      return;
    }
    const res = await fetch(`${API_BASE}/api/patients`, {
      headers: jsonHeaders(token),
    });
    if (res.ok) setPatients(await res.json());
    else setPatients([]);
  }, [token]);

  const loadAppointments = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/appointments`, {
        headers: jsonHeaders(token),
      });
      if (res.status === 401) {
        setError("Unauthorized — sign in again.");
        setAppointments([]);
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      setAppointments(await res.json());
    } catch (e) {
      setError(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setPatients([]);
      return;
    }
    loadPatients();
  }, [token, loadPatients]);

  useEffect(() => {
    if (isAuthenticated && token) loadAppointments();
    else {
      setLoading(false);
      setAppointments([]);
    }
  }, [isAuthenticated, token, loadAppointments]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!patientId || !testType.trim() || !date || !token) return;
    setSaving(true);
    setError("");
    try {
      const iso = new Date(date).toISOString();
      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify({
          patientId: Number(patientId),
          testType: testType.trim(),
          date: iso,
          status: "Pending",
        }),
      });
      if (res.status === 401) {
        setError("Unauthorized — sign in again.");
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      setTestType("");
      setDate("");
      await loadAppointments();
    } catch (e) {
      setError(e.message || "Could not create appointment");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Appointments
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Appointments are protected by JWT. Please{" "}
          <RouterLink to="/login">sign in</RouterLink> to view and create
          appointments.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Appointments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Requires a logged-in session (Bearer token). Status is set to{" "}
        <strong>Pending</strong> on the server.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          New appointment
        </Typography>
        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="patient-label">Patient</InputLabel>
            <Select
              labelId="patient-label"
              label="Patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              {patients.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  #{p.id} — {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Test type"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            size="small"
            required
            sx={{ minWidth: 160 }}
          />
          <Box sx={{ minWidth: 260 }}>
            <Typography
              component="label"
              variant="body2"
              htmlFor="appointment-datetime"
              sx={{ display: "block", mb: 0.75, color: "text.secondary" }}
            >
              Date &amp; time
            </Typography>
            <TextField
              id="appointment-datetime"
              fullWidth
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              size="small"
              variant="outlined"
              required
            />
          </Box>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Schedule"}
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Patient Id</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>When</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading…</TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No appointments yet.</TableCell>
              </TableRow>
            ) : (
              appointments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.id}</TableCell>
                  <TableCell>{a.patientId}</TableCell>
                  <TableCell>{a.testType}</TableCell>
                  <TableCell>
                    {a.date
                      ? new Date(a.date).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{a.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
