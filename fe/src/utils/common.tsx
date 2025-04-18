import dayjs, { Dayjs } from "dayjs";

/**
 * 수요일부터 시작해서 다음주 화요일까지의 날짜를 계산하는 함수
 * @param anchor 기준 날짜 (현재 날짜)
 * @returns 첫 날짜(수요일)부터 다음 주 화요일까지의 날짜 배열과 첫 날짜, 끝 날짜
 */
export const getCustomWeek = (
  anchor: Dayjs
): {
  week: { date: Dayjs; time: Dayjs | null }[];
  startDate: Dayjs;
  endDate: Dayjs;
} => {
  // 오늘 요일에 따라 수요일까지 남은 날짜 계산
  const startOfWeek =
    anchor.day() <= 3 ? anchor.day(3) : anchor.add(1, "week").day(3);

  // 수요일부터 시작해서 7일 동안의 날짜 배열 생성
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = startOfWeek.add(i, "day");
    return { date: d, time: null };
  });

  // 첫 날짜(수요일)와 끝 날짜(다음 주 화요일) 계산
  const startDate = week[0].date;
  const endDate = week[week.length - 1].date;

  return { week, startDate, endDate };
};
