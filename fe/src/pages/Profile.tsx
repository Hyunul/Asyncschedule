import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../hooks/api";

export default function Profile() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /** 사용자 정보 불러오기 */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/user/me");
        setForm((prev) => ({
          ...prev,
          email: data.email,
          username: data.username,
        }));
      } catch {
        setError("사용자 정보를 불러오지 못했습니다.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put("/api/user/update", {
        username: form.username,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("개인정보가 성공적으로 업데이트되었습니다.");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? "업데이트 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          내 정보
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <Stack spacing={2}>
            <TextField label="이메일" value={form.email} fullWidth disabled />
            <TextField
              label="닉네임"
              value={form.username}
              onChange={handleChange("username")}
              fullWidth
            />
            <TextField
              label="현재 비밀번호"
              type="password"
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              fullWidth
            />
            <TextField
              label="새 비밀번호"
              type="password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "저장"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
