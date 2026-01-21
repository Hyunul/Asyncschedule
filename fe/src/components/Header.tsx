// Header.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Box,
  Container
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getUserFromToken } from "../utils/jwt";

const Header = () => {
  /* ---------- 사용자 상태 ---------- */
  const [user, setUser] = useState<string | null>(() => getUserFromToken());
  const navigate = useNavigate();
  const location = useLocation();

  const syncUser = useCallback(() => {
    const currentUser = getUserFromToken();
    if (currentUser === null) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("custom-week-schedule");
    }
    setUser(currentUser);
  }, []);

  useEffect(syncUser, [location.pathname, syncUser]);
  useEffect(() => {
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [syncUser]);

  /* ---------- 아바타 메뉴 ---------- */
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(userAnchor);
  const handleUserOpen = (e: React.MouseEvent<HTMLElement>) =>
    setUserAnchor(e.currentTarget);
  const handleUserClose = () => setUserAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("custom-week-schedule");
    syncUser();
    handleUserClose();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 64 }}>
          {/* 로고 영역 */}
          <Stack direction="row" spacing={1} alignItems="center" component={Link} to="/" sx={{ textDecoration: "none", color: "primary.main" }}>
            <CalendarMonthIcon fontSize="large" />
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: 800, 
                letterSpacing: "-0.5px",
                background: "linear-gradient(45deg, #3f51b5 30%, #f50057 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" }
              }}
            >
              AsyncSchedule
            </Typography>
          </Stack>

          {/* 오른쪽 영역 */}
          <Stack direction="row" spacing={2} alignItems="center">
            {user ? (
              <>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary", display: { xs: "none", sm: "block" } }}>
                  <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>{user}</Box> 님
                </Typography>
                <Tooltip title="계정 설정">
                  <IconButton
                    onClick={handleUserOpen}
                    sx={{ 
                      p: 0, 
                      border: "2px solid", 
                      borderColor: "primary.light",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "primary.main", transform: "scale(1.05)" }
                    }}
                  >
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontWeight: 700 }}>
                      {user.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={userAnchor}
                  open={openUserMenu}
                  onClose={handleUserClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, minWidth: 150, borderRadius: 3 }
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleUserClose} sx={{ py: 1 }}>
                    내 정보
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1, color: "error.main", fontWeight: 500 }}>
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button 
                  variant="text" 
                  component={Link} 
                  to="/login"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  로그인
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/signup"
                  disableElevation
                  sx={{ borderRadius: 50, px: 3 }}
                >
                  회원가입
                </Button>
              </Stack>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;