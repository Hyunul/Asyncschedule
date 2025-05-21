import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const [recommendedTimes, setRecommendedTimes] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]); // 콤보박스 리스트
  const [groupId, setGroupId] = useState<string>(""); // 선택된 group_id

  useEffect(() => {
    // 초기 그룹 리스트 불러오기 (예시)
    (async () => {
      try {
        const username = getUserFromToken();
        const res = await api.get<string[]>(`/api/groups?user=${username}`);
        setGroupList(res.data);
        if (res.data.length > 0) setGroupId(res.data[0]);
      } catch (err) {
        console.error("그룹 리스트 로드 실패", err);
      }
    })();
  }, []);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const username = getUserFromToken();
      const { startDate, endDate } = getCustomWeek(dayjs());

      // groupId를 쿼리 파라미터에 포함
      const res = await api.get<
        { date: string; time: string; user: string }[]
      >(
        `/api/schedule?user=${username}&group_id=${groupId}&startDate=${startDate.format(
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

      const recomRes = await api.get<string[]>("/api/schedule/recom");
      const recommendedList = recomRes.data;

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
      setChartData(null);
      setRecommendedTimes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={500}
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="group-select-label">그룹 선택</InputLabel>
          <Select
            labelId="group-select-label"
            value={groupId}
            label="그룹 선택"
            onChange={(e) => setGroupId(e.target.value)}
          >
            {groupList.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={loadChartData}>
          검색
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : chartData ? (
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
      ) : (
        <Typography>검색 버튼을 눌러 데이터를 불러오세요.</Typography>
      )}
    </Box>
  );
};

export default Chart;
