import React from "react";
import Button from "../shared/ui-toolkit/Button";
import IconButton from "../shared/ui-toolkit/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default {
  title: "Buttons",
};

export const contained = () => (
  <Button
    variant={"contained"}
    label={"Contained"}
    backgroundColor={"#1976d2"}
    color={"white"}
  />
);
export const text = () => (
  <Button variant={"text"} label={"Text"} backgroundColor={"transparent"} />
);
export const outlined = () => (
  <Button variant={"outlined"} label={"Outlined"} color={"blue"} />
);

export const iconAtStart = () => (
  <IconButton
    startIcon={<PhotoCamera />}
    variant={"contained"}
    label={"Contained"}
    backgroundColor={"#1976d2"}
    color={"white"}
  />
);

export const iconAtEnd = () => (
  <IconButton
    endIcon={<PhotoCamera />}
    variant={"contained"}
    label={"Contained"}
    backgroundColor={"#1976d2"}
    color={"white"}
  />
);
