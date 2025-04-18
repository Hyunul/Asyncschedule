import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CloseIcon from "@mui/icons-material/Close";
import api from "../hooks/api";
import { jwtDecode } from "jwt-decode";
import "dayjs/locale/ko";
import { useNavigate } from "react-router-dom";
import { getCustomWeek } from "../utils/common"; // dateUtils에서 가져옴

dayjs.locale("ko");

type DaySchedule = {
  date: Dayjs;
  time: Dayjs | null;
};

type TokenPayload = {
  sub: string;
  username?: string;
  [key: string]: any;
};

const STORAGE_KEY = "custom-week-schedule";

const WeekSchedule: React.FC = () => {
  const [anchorDate, setAnchorDate] = useState<Dayjs>(() => dayjs());
  const [week, setWeek] = useState<DaySchedule[]>([]); // 배열로 정의
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const navigate = useNavigate();

  // 주어진 날짜에서 수요일부터 시작하는 날짜와 그 다음주 화요일까지 계산
  useEffect(() => {
    const { week, startDate, endDate } = getCustomWeek(anchorDate); // 유틸리티 함수 사용
    setWeek(week);
    setStartDate(startDate);
    setEndDate(endDate);
  }, [anchorDate]);

  // 서버에서 받은 데이터를 `week`에 반영
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const username = decoded.username || decoded.sub || "익명";
        const res = await api.get(
          `/api/schedule?user=${username}&startDate=${startDate?.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate?.format("YYYY-MM-DD")}`
        );

        // 서버에서 받은 데이터 반영
        const loadedWeek: DaySchedule[] = week.map((d) => {
          const found = res.data.find(
            (item: any) => item.date === d.date.format("YYYY-MM-DD")
          );
          return {
            date: d.date,
            time: found ? dayjs(`${found.date}T${found.time}`) : null, // 서버에서 받은 시간 설정
          };
        });

        setWeek(loadedWeek);
      } catch (err) {
        console.error("초기 데이터 불러오기 실패", err);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  // 날짜가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (startDate && endDate) {
      const payload = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        items: week.map((w) => ({
          date: w.date.toISOString(),
          time: w.time ? w.time.toISOString() : null,
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }, [week, startDate, endDate]);

  const handleTimeChange = (index: number, value: Dayjs | null) => {
    setWeek((prev) =>
      prev.map((d, i) => (i === index ? { ...d, time: value } : d))
    );
  };

  const handleRemoveTime = (index: number) => {
    setWeek((prev) =>
      prev.map((d, i) => (i === index ? { ...d, time: null } : d))
    );
  };

  const handleSubmit = async () => {
    let username = "익명";
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        username = decoded.username || decoded.sub || "익명";
      } catch (e) {
        console.warn("JWT decode 실패", e);
      }
    }

    const payload = {
      user: username,
      schedule: week.map((d) => ({
        date: d.date.format("YYYY-MM-DD"),
        time: d.time ? d.time.format("HH:mm") : null,
      })),
    };

    try {
      await api.post("/api/schedule", payload);
      alert("제출 성공!");
      navigate("/", { replace: true });
    } catch (err: any) {
      alert("제출 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 700,
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box className="flex flex-col gap-6">
              <Typography variant="h6" gutterBottom>
                기준일: {anchorDate.format("YYYY년 MM월 DD일 (ddd)")}
              </Typography>

              {/* 날짜별 입력 */}
              <Grid container spacing={0.5} rowSpacing={0.5}>
                {week.map((d, idx) => (
                  <Grid
                    key={d.date.toString()}
                    sx={{ display: "flex", justifyContent: "center", p: 0.5 }}
                    {...{ xs: 12, sm: 6, md: 4 }}
                  >
                    <TimePicker
                      label={d.date.format("MM/DD (ddd)")}
                      value={d.time}
                      onChange={(val) => handleTimeChange(idx, val)}
                      minutesStep={30}
                      views={["hours"]}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: {
                            maxWidth: 160,
                            backgroundColor: "#f9f9f9",
                            borderRadius: 1,
                            fontSize: 13,
                          },
                          InputProps: {
                            disabled: true,
                          },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* 하단 요약 */}
              <Stack spacing={1}>
                {week.map((d, idx) =>
                  d.time ? (
                    <Box
                      key={d.date.toString()}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {d.date.format("YYYY년 MM월 DD일 (ddd)")}{" "}
                        {d.time!.format("A h시")}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveTime(idx)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : null
                )}
              </Stack>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                  저장
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default WeekSchedule;
