import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
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

  // 랜덤 RGBA 색상 생성
  const r = Math.floor(Math.random() * 156 + 100);
  const g = Math.floor(Math.random() * 156 + 100);
  const b = Math.floor(Math.random() * 156 + 100);
  const color = `rgba(${r}, ${g}, ${b}, 0.6)`;

  userColorMap.set(user, color);
  return color;
};
const { startDate, endDate } = getCustomWeek(dayjs());

// 차트 옵션
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
      text: `일정표 ( 기준일 : ${startDate})`,
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

        // 1. 가장 큰 시간 값 찾기
        const allTimes = schedule.map(({ time }) => {
          const [h, m] = time.split(":").map(Number);
          return h + m / 60;
        });
        const maxValue = Math.max(...allTimes);

        const datasets = users.map((user) => {
          const userData = labels.map((date) => {
            const entry = schedule.find(
              (item) => item.user === user && item.date === date
            );
            if (entry) {
              const [h, m] = entry.time.split(":").map(Number);
              const value = h + m / 60;
              const isMax = value === maxValue;
              return {
                x: date,
                y: [0, value],
                borderColor: isMax ? "rgba(255, 0, 0, 1)" : undefined,
                borderWidth: isMax ? 2 : 0,
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
      justifyContent="center"
      alignItems="center"
      minHeight={400}
    >
      {loading || !chartData ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%", maxWidth: 700, height: 400 }}>
          <Bar options={options} data={chartData} />
        </Box>
      )}
    </Box>
  );
};

export default Chart;
