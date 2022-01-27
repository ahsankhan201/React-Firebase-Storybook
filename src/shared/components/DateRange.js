import React, { useState, memo, Fragment } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField, Box } from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';

const getDateFilterInitialState = (dateFilters) => {
  const { startDate = null, endDate = null } = dateFilters ?? {};
  return [startDate, endDate];
};

export const DateRangeFilter = memo(({ dateFilters, onFilterChanged }) => {
  const [filter, setFilter] = useState(() => getDateFilterInitialState(dateFilters));

  const onDateChange = (dates) => {
    console.log(dates);
    setFilter(dates);
    const [startDate, endDate] = dates;
    onFilterChanged({
      startDate,
      endDate,
      type: 'date-range',
      // filterConfiguration,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        value={filter}
        onChange={onDateChange}
        renderInput={(startProps, endProps) => (
          <Fragment>
            <TextField style={{flexGrow: 1}} {...startProps} />
            {/* <Box sx={{ mx: 1 }}> to </Box> */}
            <TextField style={{flexGrow: 1}} {...endProps} />
          </Fragment>
        )}
      />
    </LocalizationProvider>
  );
});
