import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArticleRenderer } from './article-renderer';

// Resolve a sample image from assets for figure stories
const imageModules = import.meta.glob('/src/assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});
const sampleImage = (Object.values(imageModules)[0] as string) ?? undefined;

const toContent = (blocks: any[]) => JSON.stringify(blocks);

const meta: Meta<typeof ArticleRenderer> = {
  title: 'Features/Articles/ArticleRenderer',
  component: ArticleRenderer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ArticleRenderer>;

export const Headers: Story = {
  args: {
    content: toContent([
      { type: 'header', level: 1, content: 'Top-Level Header' },
      { type: 'header', level: 2, content: 'Section Header' },
      { type: 'header', level: 3, content: 'Subsection Header' },
      { type: 'header', level: 4, content: 'Minor Header' },
    ]),
  },
};

export const Paragraph: Story = {
  args: {
    content: toContent([
      {
        type: 'paragraph',
        content:
          'This is a paragraph with **bold**, *italic*, and a [link](#).\n\nAnother line for readability.',
      },
    ]),
  },
};

export const CodeBlock: Story = {
  args: {
    content: toContent([
      {
        type: 'code',
        language: 'tsx',
        content: [
          'type User = { id: string; name: string }\n',
          'const users: User[] = [\n',
          "  { id: '1', name: 'Ada' },\n",
          "  { id: '2', name: 'Grace' },\n",
          '];\n',
          'console.table(users);\n',
        ].join(''),
      },
    ]),
  },
};

export const Equation: Story = {
  args: {
    content: toContent([
      {
        type: 'equation',
        content: '\\int_0^\\infty e^{-x^2} \\; dx = \\frac{\\sqrt{\\pi}}{2}',
        caption: 'Gaussian integral',
      },
    ]),
  },
};

export const Figure: Story = {
  args: {
    content: toContent([
      {
        type: 'figure',
        src: sampleImage ?? 'https://picsum.photos/600/400',
        caption: 'Sample image from assets',
      },
    ]),
  },
};

export const Notes: Story = {
  args: {
    content: toContent([
      {
        type: 'note',
        style: 'info',
        content: 'Informational note with context.',
      },
      {
        type: 'note',
        style: 'warning',
        content: 'Warning note about potential issues.',
      },
      {
        type: 'note',
        style: 'error',
        content: 'Error note indicating a failure.',
      },
      { type: 'note', content: 'Neutral note with default styling.' },
    ]),
  },
};

export const UnorderedList: Story = {
  args: {
    content: toContent([
      {
        type: 'list',
        ordered: false,
        items: ['First item', 'Second item', 'Third item'],
      },
    ]),
  },
};

export const OrderedList: Story = {
  args: {
    content: toContent([
      {
        type: 'list',
        ordered: true,
        items: ['Step one', 'Step two', 'Step three'],
      },
    ]),
  },
};

export const AllBlocks: Story = {
  args: {
    content: toContent([
      { type: 'header', level: 1, content: 'Article Title' },
      {
        type: 'paragraph',
        content: 'Intro paragraph with **markdown** and a [link](#).',
      },
      {
        type: 'code',
        language: 'ts',
        content: 'const answer = 42;\nconsole.log(answer);',
      },
      {
        type: 'equation',
        content: 'E = mc^2',
        caption: 'Mass-energy equivalence',
      },
      {
        type: 'figure',
        src: sampleImage ?? 'https://picsum.photos/600/400',
        caption: 'A figure with caption',
      },
      {
        type: 'note',
        style: 'info',
        content: 'Helpful note about the following list.',
      },
      { type: 'list', ordered: false, items: ['Alpha', 'Beta', 'Gamma'] },
      { type: 'list', ordered: true, items: ['One', 'Two', 'Three'] },
    ]),
  },
};
