import { Meta, StoryObj } from '@storybook/react-vite';

import {
  ScrollContainer,
  ScrollContainerViewport,
  ScrollContainerScrollbar,
  ScrollContainerCorner,
} from './scroll-container';

const meta: Meta = {
  title: 'UI/ScrollContainer',
  component: ScrollContainer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollContainer className="h-64 w-96 rounded-md border">
      <ScrollContainerViewport>
        <div className="space-y-4 p-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium.
          </p>
        </div>
      </ScrollContainerViewport>
      <ScrollContainerScrollbar orientation="vertical" />
      <ScrollContainerScrollbar orientation="horizontal" />
      <ScrollContainerCorner />
    </ScrollContainer>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <ScrollContainer className="h-80 w-full rounded-md border">
      <ScrollContainerViewport>
        <div className="space-y-2 p-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} className="text-sm">
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit.
            </p>
          ))}
        </div>
      </ScrollContainerViewport>
      <ScrollContainerScrollbar orientation="vertical" />
      <ScrollContainerCorner />
    </ScrollContainer>
  ),
};
