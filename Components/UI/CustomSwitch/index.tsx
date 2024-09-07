import { SwitchProps } from "@mui/material";
import React from "react";
import { IOSSwitch } from "./styled";

const CustomSwitch = (props: SwitchProps) => {
  return <IOSSwitch {...props} />;
};

export default CustomSwitch;
