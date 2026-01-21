import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // 인디고 블루 (신뢰감)
      light: "#757de8",
      dark: "#002984",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // 포인트 컬러 (핑크)
      light: "#ff5983",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f9fa", // 아주 연한 회색 배경
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif', // 프리텐다드 권장 (웹폰트 필요 시 설정)
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 }, // 버튼 텍스트 대문자 자동 변환 방지
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 버튼 둥글게
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // 카드 둥글게
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", // 부드러운 그림자
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.05)", // 헤더 그림자 최소화
          backgroundColor: "#ffffff", // 흰색 헤더
          color: "#333333", // 헤더 텍스트 검정
        },
      },
    },
  },
});

export default theme;
