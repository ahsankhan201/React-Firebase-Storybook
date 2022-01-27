import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

export const CustomIconButton = ({
  variant,
  label,
  startIcon = '',
  endIcon = '',
  backgroundColor,
  color,
  disabled = false,
}) => {
  return (
    <Button
      style={{ backgroundColor, color }}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

CustomIconButton.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.number,
  startIcon: PropTypes.element,
  endIcon: PropTypes.element,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
};
