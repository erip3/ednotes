import { Meta, StoryObj } from '@storybook/react-vite';

import { ImageTo3DSurface } from './image-surface';

// Resolve blub image from assets
const imageModules = import.meta.glob('/src/assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});
const blubImage = Object.entries(imageModules).find(([path]) =>
  path.includes('blub'),
)?.[1] as string | undefined;

const meta: Meta<typeof ImageTo3DSurface> = {
  title: 'Features/Demos/ImageTo3DSurface',
  component: ImageTo3DSurface,
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
type Story = StoryObj<typeof ImageTo3DSurface>;

export const Default: Story = {
  args: {
    imageSrc: blubImage,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the image-to-3D surface converter. Click and drag on the image to select an area, which will be visualized as a 3D surface plot based on grayscale intensity values.',
      },
    },
  },
};
