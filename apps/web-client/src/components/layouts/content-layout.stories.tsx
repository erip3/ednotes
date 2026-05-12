import { Meta, StoryObj } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';

import { ContentLayout } from './content-layout';

const meta: Meta<typeof ContentLayout> = {
  title: 'Layouts/ContentLayout',
  component: ContentLayout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContentLayout>;

export const Centered: Story = {
  args: {
    centered: true,
    title: 'Centered Layout',
    children: (
      <div className="space-y-4">
        <p>
          This is a centered layout, typically used for marketing or landing
          pages.
        </p>
        <p>
          The content is centered and has a max-width constraint for better
          readability.
        </p>
      </div>
    ),
  },
};

export const DocumentStyle: Story = {
  args: {
    centered: false,
    title: 'Document Layout',
    children: (
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-xl font-semibold">Section Title</h2>
        <p>
          This is a document-style layout, similar to reading an article or
          documentation page.
        </p>
        <p>
          The content is left-aligned with a narrower column width for better
          reading experience.
        </p>
        <h3 className="text-lg font-semibold mt-6">Subsection</h3>
        <p>More content goes here in the document style layout.</p>
      </div>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    centered: true,
    children: (
      <div className="space-y-4">
        <p>This layout doesn't have a title.</p>
        <p>The header and footer are still rendered.</p>
      </div>
    ),
  },
};
