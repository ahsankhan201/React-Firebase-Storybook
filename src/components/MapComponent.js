import React, { useEffect, useState } from 'react';
import { Button, Autocomplete, TextField, FormControl } from '@mui/material';
import { CustomSelect } from '../shared/components/Dropdown';
import { CustomMultiSelect } from '../shared/components/CustomMultiDropdown';
import { CustomMapComponent } from '../shared/components/CustomMapComponent';
import { mapSampleData, mapFarms, mapGroups } from '../data/sampleData';

const defaultValues = {
  filterByLevel: undefined,
  filterByPossibleValues: [],
  filterBy: [],
  groupBy: 'siteName',
  locationData: mapSampleData,
};

const filterByOptions = [
  { label: 'Farm', value: 'farmName' },
  { label: 'Group', value: 'groupName' },
];
const groupByOptions = [
  { label: 'Device', value: 'deviceName' },
  { label: 'Site', value: 'siteName' },
];

// const selectStyle = { m: 1, width: 'calc(100% - 800px)' };
// const selectStyle = { m: 1, width: '30%' };
const selectStyle = { m: 1, width: '200px' };
const selectStyleMulti = { m: 1, minWidth: '416px' };

export const MapAndDropDownExample = () => {
  const [groupBy, setGroupBy] = useState(defaultValues.groupBy);
  const [filterByLevel, setFilterByLevel] = useState(defaultValues.filterByLevel);
  const [filterByPossibleValues, setFilterByPossibleValues] = useState(defaultValues.filterByPossibleValues);
  const [filterBy, setFilterBy] = useState(defaultValues.filterBy);
  const [locationData, setLocationData] = useState(defaultValues.locationData);

  const setMapData = ({ filterBy, filterByLevel }) => {
    //if nothing is selected then revert back to the default locations
    if (filterBy.length === 0) {
      setLocationData(mapSampleData);
      return;
    }
    const filterByValues = filterBy.map((entry) => entry.label);
    const locationData = mapSampleData.filter((entry) => {
      return filterByValues.includes(entry[filterByLevel]);
    });
    setLocationData(locationData);
  };

  useEffect(() => {
    setMapData({ filterBy, filterByLevel });
  }, [filterBy, filterByLevel]);

  const onFilterByChangeSelect = (e) => {
    const { value } = e.target;
    console.log('onFilterByChange', value, e.target);
    setFilterBy(typeof value === 'string' ? value.split(',') : value);
  };

  const onFilterByChange = (event, value) => {
    const filterByValues = value.map((entry) => entry.label);
    console.log('onFilterByChange', value, filterByValues);
    setFilterBy(value);
  };

  const onReset = (e) => {
    setFilterByLevel(defaultValues.filterByLevel);
    setFilterBy(defaultValues.filterBy);
    setLocationData(defaultValues.locationData);
  };
  const onGroupByChange = (e) => {
    const { value } = e.target;
    console.log('onGroupByChange', value);
    setGroupBy(value);
  };
  const onFilterLevelChange = (e) => {
    const { value } = e.target;
    console.log('onFilterLevelChange', value);
    setFilterByLevel(value);
    setFilterBy([]);
    setFilterByPossibleValues(getFilterByPossibleValues(value));
  };

  return (
    <div>
      <div>
        <CustomSelect
          options={groupByOptions}
          onSelectChange={onGroupByChange}
          label={'Group By'}
          selectedValue={groupBy}
          sx={selectStyle}
        />
        <CustomSelect
          options={filterByOptions}
          onSelectChange={onFilterLevelChange}
          label={'Filter  By'}
          selectedValue={filterByLevel}
          sx={selectStyle}
        />
        {/*<CustomMultiSelect*/}
        {/*  options={filterByPossibleValues}*/}
        {/*  onSelectChange={onFilterByChangeSelect}*/}
        {/*  label={"Filters"}*/}
        {/*  selectedValue={filterBy}*/}
        {/*  disabled={filterByLevel === undefined}*/}
        {/*/>*/}
        <AutocompleteMulti
          options={filterByPossibleValues}
          defaultValue={defaultValues.filterBy}
          disabled={filterByLevel === undefined}
          onChange={onFilterByChange}
          value={filterBy}
          sx={selectStyleMulti}
        />
      </div>
      {filterBy.length > 0 && <Button onClick={onReset}>Clear filters</Button>}
      <CustomMapComponent zoom={14} markers={locationData} label={groupBy} />
    </div>
  );
};

function AutocompleteMulti({ options, defaultValue, disabled, onChange, value, sx }) {
  return (
    <FormControl sx={sx}>
      <Autocomplete
        disabled={disabled}
        onChange={onChange}
        value={value}
        multiple
        id="tags-outlined"
        options={options}
        // getOptionLabel={(option) => option}
        defaultValue={defaultValue}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Filters" placeholder="Filters" />
        )}
      />
    </FormControl>
  );
}

function getFilterByPossibleValues(option) {
  switch (option) {
    case 'farmName':
      return mapFarms.map((farm) => ({
        label: farm.farmName,
        value: farm.farmId,
      }));
    case 'groupName':
      return mapGroups.map((group) => ({
        label: group.groupName,
        value: group.groupId,
      }));
    case 'deviceName':
      return mapSampleData.map((device) => ({
        label: device.deviceName,
        value: device.deviceId,
      }));
    default:
      return mapSampleData.map((device) => ({
        label: device.deviceName,
        value: device.deviceId,
      }));
  }
}
