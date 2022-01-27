import * as React from 'react';
import { OutlinedInput, InputLabel, MenuItem, Box, FormControl, Select } from '@mui/material';
import PropTypes from 'prop-types';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const CustomSelect = ({
  options = [],
  onSelectChange,
  isMulti,
  label = '',
  disabled = false,
  selectedValue,
  sx = { m: 1, width: '100%', margin: 0 },
}) => {
  return (
    <FormControl sx={sx}>
      <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple={isMulti}
        value={selectedValue}
        onChange={onSelectChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
        disabled={disabled}
      >
        <MenuItem value={'Choose'} disabled>
          Choose
        </MenuItem>
        {options?.map(({ label, value }) => (
          <MenuItem style={{ display: 'block' }} key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.array,
  onSelectChange: PropTypes.func,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
