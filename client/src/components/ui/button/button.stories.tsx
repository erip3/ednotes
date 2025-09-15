import { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default story for the Button component
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};
