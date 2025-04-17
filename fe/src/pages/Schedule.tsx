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

const getCustomWeek = (anchor: Dayjs): DaySchedule[] => {
  const start = anchor.startOf("day");
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.add(i, "day");
    return { date: d, time: null };
  });
};

const WeekSchedule: React.FC = () => {
  const [anchorDate, setAnchorDate] = useState<Dayjs>(() => dayjs());
  const [week, setWeek] = useState<DaySchedule[]>(getCustomWeek(dayjs()));

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const username = decoded.username || decoded.sub || "익명";
        const res = await api.get(`/api/schedule?user=${username}`);

        const loadedWeek: DaySchedule[] = getCustomWeek(dayjs()).map((d) => {
          const found = res.data.schedule.find(
            (item: any) => item.date === d.date.format("YYYY-MM-DD")
          );
          return {
            date: d.date,
            time: found ? dayjs(`${found.date}T${found.time}`) : null,
          };
        });

        setWeek(loadedWeek);
      } catch (err) {
        console.error("초기 데이터 불러오기 실패", err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const payload = {
      anchor: anchorDate.toISOString(),
      items: week.map((w) => ({
        date: w.date.toISOString(),
        time: w.time ? w.time.toISOString() : null,
      })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [week, anchorDate]);

  useEffect(() => {
    setWeek(getCustomWeek(anchorDate));
  }, [anchorDate]);

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
                        {d.time!.format("A hh시")}
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

              {/* 제출 버튼 */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="contained" onClick={handleSubmit}>
                  제출
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
