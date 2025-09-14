import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <Header />,
};
