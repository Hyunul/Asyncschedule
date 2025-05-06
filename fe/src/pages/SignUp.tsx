// SignUp.tsx
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";

interface SignUpForm {
  email: string;
  password: string;
  username: string;
}

export default function SignUp() {
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /** input 공통 핸들러 */
  const handleChange =
    (key: keyof SignUpForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /** 회원가입 버튼 클릭 */
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/api/auth/register", form);
      alert("회원가입에 성공하였습니다.");
      navigate("/login", { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? "알 수 없는 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          회원가입
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={2}>
            <TextField
              label="이메일"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
            />
            <TextField
              label="비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              fullWidth
            />
            <TextField
              label="닉네임"
              value={form.username}
              onChange={handleChange("username")}
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "회원가입"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
