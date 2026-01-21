import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import {
  Box,
  Card,
  CardActionArea,
  Container,
  Typography,
  useTheme,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utils/jwt";

const featureCards = [
  {
    title: "대시보드",
    subtitle: "전체 현황을 한눈에 파악하세요 (준비중)",
    icon: <DashboardIcon sx={{ fontSize: 60, color: "primary.main" }} />,
    to: "/dashboard",
    disabled: true
  },
  {
    title: "일정 관리",
    subtitle: "내 일정을 쉽고 빠르게 등록하세요",
    icon: <EventIcon sx={{ fontSize: 60, color: "secondary.main" }} />,
    to: "/schedule",
    disabled: false
  },
  {
    title: "모임 통계",
    subtitle: "팀원들의 최적 모임 시간을 확인하세요",
    icon: <BarChartIcon sx={{ fontSize: 60, color: "success.main" }} />,
    to: "/stats",
    disabled: false
  },
];

const Home = () => {
  const user = getUserFromToken();
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 10,
          mb: 6,
          borderRadius: { xs: 4, md: "40px" },
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          boxShadow: 3
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            팀 일정을 스마트하게, AsyncSchedule
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            복잡한 일정 조율은 이제 그만. <br />
            팀원들의 시간을 분석하여 최적의 모임 시간을 추천해드립니다.
          </Typography>
          {!user && (
             <Button 
             variant="contained" 
             color="secondary" 
             size="large" 
             component={Link} 
             to="/login"
             sx={{ px: 5, py: 1.5, fontSize: "1.1rem", borderRadius: 50 }}
           >
             지금 시작하기
           </Button>
          )}
        </Container>
      </Box>

      {/* Feature Cards Section */}
      <Box sx={{ mb: 10 }}>
        {user ? (
           <Box>
             <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
               무엇을 하고 싶으신가요?
             </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
              gap: 4 
            }}>
              {featureCards.map(({ title, subtitle, icon, to, disabled }) => (
                <Card 
                  key={title}
                  elevation={0}
                  sx={{ 
                    height: "100%", 
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[10],
                      borderColor: "transparent"
                    }
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={to}
                    disabled={disabled}
                    sx={{ 
                      height: "100%", 
                      p: 4, 
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: "50%" }}>
                      {icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {subtitle}
                    </Typography>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              로그인 후 더 많은 기능을 이용해보세요.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
