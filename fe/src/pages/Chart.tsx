// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import { Box, CircularProgress } from "@mui/material";
// import api from "../hooks/api"; // api 모듈 경로는 프로젝트에 맞게 조정하세요
// import { getUserFromToken } from "../utils/jwt";
// import { getCustomWeek } from "../utils/common"; // getCustomWeek 함수 임포트
// import dayjs from "dayjs";

// const Chart = () => {
//   const [series, setSeries] = useState<{ name: string; data: any[] }[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const username = getUserFromToken();

//         // getCustomWeek를 사용하여 첫 날짜와 끝 날짜 계산
//         const { startDate, endDate } = getCustomWeek(dayjs());

//         // API 요청 시 첫 날짜와 끝 날짜를 쿼리 파라미터로 포함시킴
//         const res = await api.get<{
//           data: { date: string; time: string; user: string; id: number }[];
//         }>(
//           `/api/schedule?user=${username}&startDate=${startDate.format(
//             "YYYY-MM-DD"
//           )}&endDate=${endDate.format("YYYY-MM-DD")}`
//         );

//         // 응답 데이터 구조 확인하기
//         console.log(res); // 여기를 통해 응답 구조 확인

//         // 응답에서 schedule 데이터가 존재하는지 확인하고, 없으면 빈 배열을 사용
//         if (res.data && Array.isArray(res.data)) {
//           // 퇴근 시간을 시간(소수)으로 변환
//           const parsed = res.data.map(({ date, time }) => {
//             const [h, m] = time.split(":").map(Number);
//             return { date, hour: h + m / 60 };
//           });

//           // 가장 늦은 퇴근 시간 구하기
//           const maxHour = Math.max(...parsed.map((p) => p.hour));

//           // 차트용 데이터 포맷
//           const formattedData = parsed.map(({ date, hour }) => ({
//             x: date,
//             y: [hour],
//             fillColor: hour === maxHour ? "#FF4560" : "#009FFB", // 강조 색상 적용
//           }));

//           setSeries([{ name: "퇴근 시간", data: formattedData }]);
//         } else {
//           console.error("No schedule data available in the response.");
//         }
//       } catch (err) {
//         console.error("데이터 로드 실패", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const options: ApexOptions = {
//     chart: {
//       type: "rangeBar",
//       height: 350,
//     },

//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: true,
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val: number, opts: any) => {
//         // 가장 늦은 퇴근 시간에만 값을 표시
//         const hour = opts.w.config.series[0].data[opts.dataPointIndex].y[0];
//         const maxHour = Math.max(
//           ...opts.w.config.series[0].data.map((item: any) => item.y[0])
//         );
//         return hour === maxHour ? `${val}시` : ""; // 가장 늦은 시간에만 표시
//       },
//     },
//     xaxis: {
//       type: "numeric",
//       min: 0,
//       max: 24,
//       tickAmount: 12,
//       labels: {
//         formatter: (val) => `${val}시`,
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           fontSize: "14px",
//         },
//       },
//     },
//   };

//   return (
//     <Box
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="400px"
//     >
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <ReactApexChart
//           type="bar"
//           options={options}
//           series={series}
//           width={700}
//           height={400}
//         />
//       )}
//     </Box>
//   );
// };

// export default Chart;

import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "@mui/x-charts"; // MUI 차트 라이브러리
import api from "../hooks/api"; // api 모듈 경로는 프로젝트에 맞게 조정하세요
import { getUserFromToken } from "../utils/jwt";
import { getCustomWeek } from "../utils/common"; // getCustomWeek 함수 임포트
import dayjs from "dayjs";

const Chart = () => {
  const [series, setSeries] = useState<any[]>([]); // MUI 차트를 위한 시리즈 데이터
  const [loading, setLoading] = useState(true);
  const [xAxisData, setXAxisData] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = getUserFromToken();

        // getCustomWeek를 사용하여 첫 날짜와 끝 날짜 계산
        const { startDate, endDate } = getCustomWeek(dayjs());

        // API 요청 시 첫 날짜와 끝 날짜를 쿼리 파라미터로 포함시킴
        const res = await api.get<{
          data: { date: string; time: string; user: string; id: number }[];
        }>(
          `/api/schedule?user=${username}&startDate=${startDate.format(
            "YYYY-MM-DD"
          )}&endDate=${endDate.format("YYYY-MM-DD")}`
        );

        // 응답 데이터 구조 확인하기
        console.log(res); // 여기를 통해 응답 구조 확인

        // 응답에서 schedule 데이터가 존재하는지 확인하고, 없으면 빈 배열을 사용
        if (res.data && Array.isArray(res.data)) {
          // user별로 데이터를 그룹화
          const groupedByUser = res.data.reduce((acc, { date, time, user }) => {
            if (!acc[user]) {
              acc[user] = [];
            }
            const [h, m] = time.split(":").map(Number);
            acc[user].push({ date, timeInHours: h + m / 60 });
            return acc;
          }, {});

          // xAxisData에 날짜를 추가
          const xAxisData = Array.from(
            new Set(res.data.map((item) => item.date))
          );

          // 시리즈 데이터를 user별로 형식에 맞게 변환
          const formattedSeries = Object.keys(groupedByUser).map((user) => {
            return {
              name: user,
              data: groupedByUser[user].map(({ timeInHours }) => timeInHours),
              fillColor: "#009FFB", // 차트 색상 적용
            };
          });

          setXAxisData(xAxisData);
          setSeries(formattedSeries);
        } else {
          console.error("No schedule data available in the response.");
        }
      } catch (err) {
        console.error("데이터 로드 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Box width="100%" height="400px">
          <BarChart series={series}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((s, index) => (
              <Bar
                key={index}
                dataKey="data"
                data={s.data}
                fill={s.fillColor}
              />
            ))}
          </BarChart>
        </Box>
      )}
    </Box>
  );
};

export default Chart;
