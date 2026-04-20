import {
  Alert,
  Box,
  Button,
  Paper,
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

export default function PatientsPage() {
  const { token, isAuthenticated } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        headers: jsonHeaders(token),
      });
      if (res.status === 401) {
        setError("Unauthorized — sign in again.");
        setPatients([]);
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      setPatients(await res.json());
    } catch (e) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setPatients([]);
      return;
    }
    load();
  }, [token, load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !dob || !token) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: jsonHeaders(token),
        body: JSON.stringify({ name: name.trim(), dob }),
      });
      if (res.status === 401) {
        setError("Unauthorized — sign in again.");
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      setName("");
      setDob("");
      await load();
    } catch (e) {
      setError(e.message || "Could not add patient");
    } finally {
      setSaving(false);
    }
  };

  const formatDob = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return String(value);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Patients
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Patient records require authentication. Please{" "}
          <RouterLink to="/login">sign in</RouterLink> to view and add patients.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Patients
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List and add patients (JWT required). Use{" "}
        <code style={{ fontSize: "0.85em" }}>name</code> and{" "}
        <code style={{ fontSize: "0.85em" }}>dob</code> (ISO date).
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add patient
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
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            required
            sx={{ minWidth: 200 }}
          />
          <Box sx={{ minWidth: 220 }}>
            <Typography
              component="label"
              variant="body2"
              htmlFor="patient-dob"
              sx={{ display: "block", mb: 0.75, color: "text.secondary" }}
            >
              Date of birth
            </Typography>
            <TextField
              id="patient-dob"
              fullWidth
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              size="small"
              variant="outlined"
              inputProps={{
                max: "2100-12-31",
                min: "1900-01-01",
              }}
              required
            />
          </Box>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Add"}
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading…</TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No patients yet.</TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{formatDob(p.dob)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
