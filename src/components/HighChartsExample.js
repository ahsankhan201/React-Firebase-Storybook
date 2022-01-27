import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { VerticalBarChart } from "./index";
import Button from "../shared/ui-toolkit/Button";
import { pollinatorReportSampleData as aggregatedData } from "../data/sampleData";
import { CustomSelect } from "../shared/components/Dropdown";
import { datePickerDropDownConfig as selectDurationsData } from "../config/componentConfig";
const defaultActiveFilter = "days";

export const HighChartComponent = () => {
  const getDefaultDurationValue = (filter) => {
    //select the first value in the array as the default
    return selectDurationsData[filter][0].value;
  }
  const getChartData = (filter, selectedDuration) => {
    return aggregatedData[filter].slice(0, selectedDuration);
  }
  const [activeFilter, setActiveFilter] = useState(defaultActiveFilter);
  const [aggregationButtons, setAggregationButtons] = useState([
            { title: "days", active: true },
            { title: "weeks", active: false },
            { title: "months", active: false },
        ]);
  const [durations, setDurations] = useState(selectDurationsData[defaultActiveFilter]);
  const [selectedDuration, setSelectedDuration] = useState(getDefaultDurationValue(defaultActiveFilter));
  const [chartOptions, setChartOptions] = useState({});
  const [chartData, setChartData] = useState(getChartData(defaultActiveFilter, selectedDuration));

  useEffect(
      function prepareChartData() {
        let xAxisLabel = [];
        let seriesData = [];
        chartData?.forEach((item) => {
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
        setChartOptions(options);
      },
      [chartData]
  );

  useEffect(() => {
    setChartData(getChartData(activeFilter, selectedDuration));
  }, [activeFilter, selectedDuration]);

  const onFilterChange = (filter) => {
    const updatedDurations = selectDurationsData[filter];
    let updatedButtonsData = aggregationButtons.map((item) => {
      return {
        ...item,
        active: filter === item.title ? !item.active : false,
      };
    });

    setAggregationButtons(updatedButtonsData);
    setDurations(updatedDurations);
    setActiveFilter(filter);
    setSelectedDuration(getDefaultDurationValue(filter));
  };
  const onSelectDuration = (e) => {
    const { value } = e.target;
    setSelectedDuration(value);
  };
  return (
      <div>
        <DurationFilter
            filters={aggregationButtons}
            onFilterChange={onFilterChange}
        />
        <CustomSelect
            options={durations}
            onSelectChange={onSelectDuration}
            label={"Duration"}
            selectedDuration={selectedDuration}
        />
        <VerticalBarChart options={chartOptions} />
        <PollinationReportOverview data={chartData} />
      </div>
  );
};

const DurationFilter = ({ filters = [], onFilterChange }) => {
  return filters.map((filter) => (
      <Button
          variant={filter.active ? "contained" : "outlined"}
          label={filter.title}
          onButtonClick={() => onFilterChange(filter.title)}
      />
  ));
};

const PollinationReportOverview = ({ data = [] }) => {
  const dayLightHours = data.map((item) => item.daylightHours);
  const averageWeatherRecords = data.map((item) => item.tempAverage);
  const windSpeeds = data.map((item) => item.wind);
  const temperatureRanges = data.map(({ tempHigh, tempLow }) => ({
    tempLow,
    tempHigh,
  }));
  return (
      <Grid container style={{ width: "100%" }}>
        {/**Day Light */}
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Typography variant="h6">Day Light Hours</Typography>
          </Grid>
          <Grid
              item
              xs={10}
              style={{ display: "flex", justifyContent: "space-around" }}
          >
            {dayLightHours.map((hour) => (
                <span>{hour}</span>
            ))}
          </Grid>
        </Grid>

        {/** Weather Records */}

        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Typography variant="h6">Weather</Typography>
          </Grid>
          <Grid
              item
              xs={10}
              style={{ display: "flex", justifyContent: "space-around" }}
          >
            {averageWeatherRecords.map((weather) => (
                <span>{weather}</span>
            ))}
          </Grid>
        </Grid>

        {/** Wind Speed */}

        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Typography variant="h6">Wind Speeds</Typography>
          </Grid>
          <Grid
              item
              xs={10}
              style={{ display: "flex", justifyContent: "space-around" }}
          >
            {windSpeeds.map((wind) => (
                <span>{wind}</span>
            ))}
          </Grid>
        </Grid>

        {/** Temperature Highs/Lows */}
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Typography variant="h6">Day Light Hours</Typography>
          </Grid>
          <Grid
              item
              xs={10}
              style={{ display: "flex", justifyContent: "space-around" }}
          >
            {temperatureRanges.map(({ tempHigh, tempLow }) => (
                <span style={{ display: "flex", flexDirection: "column" }}>
              <span>{tempHigh}</span>
              <span>{tempLow}</span>
            </span>
            ))}
          </Grid>
        </Grid>
      </Grid>
  );
};
