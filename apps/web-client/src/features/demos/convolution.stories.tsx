import { Meta, StoryObj } from '@storybook/react-vite';

import { ConvolutionDemo } from './convolution';

const meta: Meta<typeof ConvolutionDemo> = {
  title: 'Features/Demos/ConvolutionDemo',
  component: ConvolutionDemo,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConvolutionDemo>;

export const SharpeningKernel: Story = {
  args: {
    size: 5,
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    borderMethod: 'zero',
    interval: 500,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates 2D convolution with a sharpening kernel. The animation shows how the kernel moves across the input matrix to produce the output.',
      },
    },
  },
};

export const EdgeDetection: Story = {
  args: {
    size: 5,
    kernel: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    borderMethod: 'zero',
    interval: 500,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Edge detection kernel (Laplacian) that highlights edges and boundaries in the input matrix.',
      },
    },
  },
};

export const BlurKernel: Story = {
  args: {
    size: 5,
    kernel: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    borderMethod: 'replicate',
    interval: 500,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Box blur kernel that averages neighboring pixels. Uses replicate border method to handle edges.',
      },
    },
  },
};

export const FastAnimation: Story = {
  args: {
    size: 5,
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    borderMethod: 'zero',
    interval: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Faster animation speed (200ms intervals) for quicker demonstration.',
      },
    },
  },
};
