import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export function getDashboardAnalyticsData() {
  const month = new Date().getMonth() + 1;

  let xAxis: string[] = [],
    yAxis: number[] = [];

  for (let i = 1; i < 31; i++) {
    xAxis.push(dayjs(`${month}-${i}`).format("D MMM"));

    yAxis.push(parseFloat(Math.random().toFixed(2)) * 500);
  }

  return {
    xAxis,
    yAxis,
  };
}
