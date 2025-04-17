import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Box, CircularProgress } from "@mui/material";
import api from "../hooks/api"; // api 모듈 경로는 프로젝트에 맞게 조정하세요
import { getUserFromToken } from "../utils/jwt";

const Chart = () => {
  const [series, setSeries] = useState<{ name: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = getUserFromToken();
        const res = await api.get<{
          schedule: { date: string; time: string }[];
        }>("/api/schedule?user=wjjung");

        // 퇴근 시간을 시간(소수)으로 변환
        const parsed = res.data.schedule.map(({ date, time }) => {
          const [h, m] = time.split(":").map(Number);
          return { date, hour: h + m / 60 };
        });

        // 가장 늦은 퇴근 시간 구하기
        const maxHour = Math.max(...parsed.map((p) => p.hour));

        // 차트용 데이터 포맷
        const formattedData = parsed.map(({ date, hour }) => ({
          x: date,
          y: [hour],
          fillColor: hour === maxHour ? "#FF4560" : "#009FFB", // 강조 색상 적용
        }));

        setSeries([{ name: "퇴근 시간", data: formattedData }]);
      } catch (err) {
        console.error("데이터 로드 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "rangeBar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "numeric",
      min: 0,
      max: 24,
      tickAmount: 12,
      labels: {
        formatter: (val) => `${val}시`,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <ReactApexChart
          type="bar"
          options={options}
          series={series}
          width={700}
          height={400}
        />
      )}
    </Box>
  );
};

export default Chart;
