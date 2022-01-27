import React from "react";
import { VerticalBarChart } from "../components";
import { pollinatorReportSampleData as pollinationReport } from "../data/sampleData";

export default {
  title: "Pollinator Report",
};

const getChartData = (duration = "days") => {
  let xAxisLabel = [];
  let seriesData = [];
  pollinationReport[duration].forEach((item) => {
    xAxisLabel.push(item.label);
    seriesData.push(item.tempAverage);
  });
  const options = {
    title: {
      text: "Pollinator Report",
    },

    series: [
      {
        type: "column",
        data: seriesData,
      },
    ],
    xAxis: {
      categories: xAxisLabel,
    },
  };
  return options;
};

export const DailyColumnChart = () => (
  <VerticalBarChart options={getChartData("days")} />
);

export const WeeklyColumnChart = () => (
  <VerticalBarChart options={getChartData("weeks")} />
);

export const MonthlyColumnChart = () => (
  <VerticalBarChart options={getChartData("month")} />
);
