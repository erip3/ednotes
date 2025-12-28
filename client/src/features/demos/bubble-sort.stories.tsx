import { Meta, StoryObj } from '@storybook/react-vite';

import { BubbleSortDemo } from './bubble-sort';

const meta: Meta<typeof BubbleSortDemo> = {
  title: 'Features/Demos/BubbleSortDemo',
  component: BubbleSortDemo,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BubbleSortDemo>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive visualization of the bubble sort algorithm. Click "Step" to advance one comparison at a time, or "Play" to watch the full animation. Yellow bars indicate the current comparison being made.',
      },
    },
  },
};
