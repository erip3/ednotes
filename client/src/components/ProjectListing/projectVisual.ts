import React, { type JSX } from "react";
import NotesIcon from "./Icons/NotesIcon";

export const projectVisuals: Record<
  string,
  { icon: () => JSX.Element }
> = {
  ednotes: {
    icon: () => React.createElement(NotesIcon),
  },
  
};