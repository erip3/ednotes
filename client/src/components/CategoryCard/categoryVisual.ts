import React, { type JSX } from 'react';

import ReactIcon from './Icons/ReactIcon';

export const categoryVisuals: Record<
  string,
  { icon: () => JSX.Element; accentColor: string }
> = {
  react: {
    icon: () => React.createElement(ReactIcon),
    accentColor: '#2196f3',
  },
  // Add more categories as needed
};
