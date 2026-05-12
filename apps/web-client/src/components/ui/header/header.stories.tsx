import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => (
    <div className="w-full">
      <Header />
    </div>
  ),
};
