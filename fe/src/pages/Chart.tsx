import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../hooks/api";
import { getCustomWeek } from "../utils/common";
import dayjs from "dayjs";
import { getUserFromToken } from "../utils/jwt";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const userColorMap = new Map<string, string>();

const getColorForUser = (user: string): string => {
  if (userColorMap.has(user)) {
    return userColorMap.get(user)!;
  }

  const r = Math.floor(Math.random() * 156 + 100);
  const g = Math.floor(Math.random() * 156 + 100);
  const b = Math.floor(Math.random() * 156 + 100);
  const color = `rgba(${r}, ${g}, ${b}, 0.6)`;

  userColorMap.set(user, color);
  return color;
};

const options = {
  indexAxis: "y" as const,
  scales: {
    x: {
      max: 24,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const raw = context.raw as [number, number];
          const start = raw[1];
          const user = context.dataset.label;
          return `${user}의 퇴근 시간 : ${start}시`;
        },
      },
    },
    title: {
      display: true,
      text: `일정표`,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const Chart: React.FC = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [recommendedTimes, setRecommendedTimes] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const username = getUserFromToken();
        const { startDate, endDate } = getCustomWeek(dayjs());

        const res = await api.get<
          { date: string; time: string; user: string }[]
        >(
          `/api/schedule?user=${username}&startDate=${startDate.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate.format("YYYY-MM-DD")}`
        );
        const schedule = res.data;

        const labels = Array.from(
          new Set(schedule.map((item) => item.date))
        ).sort();

        const users = Array.from(
          new Set(schedule.map((item) => item.user))
        ).sort();

        const test = await api.get("/api/schedule/recom");

        const recommendedList = test.data;

        const datasets = users.map((user) => {
          const userData = labels.map((date) => {
            const entry = schedule.find(
              (item) => item.user === user && item.date === date
            );

            if (entry) {
              const [h, m] = entry.time.split(":").map(Number);
              const value = h + m / 60;
              const isRecommended = value >= 19 && value <= 21;

              return {
                x: date,
                y: [0, value],
                borderColor: isRecommended ? "rgba(255, 0, 0, 1)" : undefined,
                borderWidth: isRecommended ? 2 : 0,
              };
            }

            return {
              x: date,
              y: [0, 0],
            };
          });

          return {
            label: user,
            data: userData.map((d) => d.y),
            backgroundColor: getColorForUser(user),
            borderColor: userData.map((d) => d.borderColor),
            borderWidth: userData.map((d) => d.borderWidth),
          };
        });

        setChartData({
          labels,
          datasets,
        });

        setRecommendedTimes(recommendedList);
      } catch (err) {
        console.error("데이터 로드 실패", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={500}
    >
      {loading || !chartData ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ width: "100%", maxWidth: 1000, height: 600 }}>
            <Bar options={options} data={chartData} />
          </Box>

          {recommendedTimes.length > 0 && (
            <Box
              mt={4}
              sx={{ textAlign: "left", width: "100%", maxWidth: 1000 }}
            >
              <Typography variant="h6" gutterBottom>
                ✅ 추천 일정 시간대 (19~21시):
              </Typography>
              {recommendedTimes.map((item, idx) => (
                <Typography key={idx} variant="body2">
                  • {item}
                </Typography>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Chart;
