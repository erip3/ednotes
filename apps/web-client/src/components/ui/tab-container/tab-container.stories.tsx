import { Meta, StoryObj } from '@storybook/react-vite';

import { TabContainer } from './tab-container';

import { ArticleRenderer } from '@/features/articles/components/article-renderer';

const meta: Meta<typeof TabContainer> = {
  title: 'UI/TabContainer',
  component: TabContainer,
};

export default meta;

type Story = StoryObj<typeof TabContainer>;

const summaryBlocks = [
  { type: 'header', level: 2, content: 'Summary' },
  {
    type: 'paragraph',
    content:
      'A compact mini-article that previews the most important takeaways without overwhelming the reader.',
  },
  {
    type: 'list',
    ordered: false,
    items: [
      'Aligns with article typography tokens.',
      'Tabs switch instantly with a gentle fade.',
      'Height animates to match the active tab.',
    ],
  },
];

const detailBlocks = [
  { type: 'header', level: 3, content: 'What is inside?' },
  {
    type: 'paragraph',
    content:
      'Everything an article supports: headings, lists, quotes, inline code, and even diagrams if you render them.',
  },
  {
    type: 'note',
    style: 'info',
    content:
      'Tabs reorganize the same story for different audiences without duplicating content.',
  },
];

const actionBlocks = [
  { type: 'header', level: 3, content: 'Suggested next moves' },
  {
    type: 'list',
    ordered: true,
    items: [
      'Publish the summary to the main article.',
      'Attach supporting links and references.',
      'Assign owners for each follow-up task.',
    ],
  },
  {
    type: 'paragraph',
    content:
      'Tip: place checklists or call-to-action buttons here to keep this tab action-oriented.',
  },
];

const tabs = [
  {
    value: 'summary',
    label: 'Summary',
    description: 'Quick context',
    content: <ArticleRenderer content={JSON.stringify(summaryBlocks)} />,
  },
  {
    value: 'details',
    label: 'Details',
    description: 'Deeper read',
    content: <ArticleRenderer content={JSON.stringify(detailBlocks)} />,
  },
  {
    value: 'actions',
    label: 'Actions',
    description: 'Next steps',
    content: <ArticleRenderer content={JSON.stringify(actionBlocks)} />,
  },
];

export const Default: Story = {
  args: { tabs },
};
