import React, { type JSX } from "react";
import ReactIcon from "./Icons/ReactIcon";

export const categoryVisuals: Record<
  number,
  { icon: () => JSX.Element; accentColor: string }
> = {
  7: {
    // React
    icon: () => React.createElement(ReactIcon),
    accentColor: "#2196f3",
  },
};
