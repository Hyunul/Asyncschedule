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
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getUserFromToken } from "../utils/jwt";

const Header = () => {
  /* ---------- 사용자 상태 ---------- */
  const [user, setUser] = useState<string | null>(() => getUserFromToken());
  const navigate = useNavigate();
  const location = useLocation();
  const syncUser = useCallback(() => setUser(getUserFromToken()), []);

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
    setUser(null);
    handleUserClose();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 로고 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          My App
        </Typography>

        {/* 오른쪽 영역 */}
        <Stack direction="row" spacing={2} alignItems="center">
          {user ? (
            <>
              <Typography variant="body1">{user} 님, 어서오세요!</Typography>
              <Tooltip title="메뉴 열기">
                <IconButton
                  onClick={handleUserOpen}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={userAnchor}
                open={openUserMenu}
                onClose={handleUserClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleUserClose}
                >
                  내 정보
                </MenuItem>
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" component={Link} to="/login">
                로그인
              </Button>
              <Button variant="contained" component={Link} to="/signup">
                회원가입
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
