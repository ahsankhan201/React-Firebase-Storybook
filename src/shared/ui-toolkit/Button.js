import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

export default function CustomButton({
  variant,
  label,
  backgroundColor,
  color,
  onButtonClick,
}) {
  return (
    <Button
      style={{ backgroundColor: backgroundColor, color }}
      variant={variant}
      onClick={(e) => (onButtonClick ? onButtonClick(e) : "")}
    >
      {label}
    </Button>
  );
}

CustomButton.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  onButtonClick: PropTypes.func,
  disabled: PropTypes.bool,
};
