import { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionRoot,
} from './accordion';

const meta: Meta<typeof Accordion> = {
  component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const DemoAccordion = () => (
  <div className="dark min-h-screen bg-background p-8">
    <AccordionRoot>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>
            <span className="text-lg font-medium">Accordion Header 1</span>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content for item 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>
            <span className="text-lg font-medium">Accordion Header 2</span>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Content for item 2</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  </div>
);

export const Default: Story = {
  render: () => <DemoAccordion />,
};
