/**
 * @module features/articles/components/article-renderer
 * @description Renders article content blocks with rich formatting, equations, images, and interactive demos
 *
 * Supported block types:
 * - **header**: Markdown-style headers (h1-h6) with responsive sizing
 * - **paragraph**: Text with inline markdown support (bold, italic, links, lists)
 * - **code**: Syntax-highlighted code blocks
 * - **equation**: LaTeX/KaTeX mathematical equations
 * - **figure**: Images with captions; resolves image IDs to asset URLs
 * - **note**: Styled callout boxes (info, warning, error)
 * - **demo**: Interactive demonstrations (bubble sort, convolution, DFA, image surface)
 * - **list**: Ordered or unordered lists
 *
 * Content format:
 * Articles store content as a JSON array of block objects. Each block has a `type` field
 * and type-specific properties (e.g., `content`, `level`, `src`, `demoType`).
 *
 * Image resolution:
 * Images are resolved from the @/assets/images directory. Demos reference images by ID
 * (e.g., `"src": "shapes"`), which are resolved to URLs at render time.
 *
 * @example
 * const content = JSON.stringify([
 *   { type: 'header', level: 1, content: 'Title' },
 *   { type: 'paragraph', content: 'Paragraph text with **bold** and *italic*' },
 *   { type: 'equation', content: '\\\\nabla f(x,y) = ...' },
 *   { type: 'figure', src: 'image.png', caption: 'Figure caption' },
 *   { type: 'demo', demoType: 'imageToSurface', src: 'myImage' }
 * ]);
 * <ArticleRenderer content={content} />
 */

import React, { useMemo, type JSX } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';

import type { ArticleBlock } from '../types/article-content';

import { TabContainer } from '@/components/ui/tab-container/tab-container';
import { BubbleSortDemo } from '@/features/demos/bubble-sort';
import { ConvolutionDemo } from '@/features/demos/convolution';
import { ImageTo3DSurface } from '@/features/demos/image-surface';

// Registry of demo components by name
const demoRegistry: Record<string, React.ComponentType<any>> = {
  bubbleSort: BubbleSortDemo,
  imageSurface: ImageTo3DSurface,
  convolution: ConvolutionDemo,
};

// Map filenames to imported images using Vite's glob import
const images = import.meta.glob('@/assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

/**
 * Resolves an image filename or ID to its imported URL in the assets directory.
 *
 * @param filename - Image filename or ID (e.g., "shapes", "shapes.jpg")
 * @returns Full URL to the image asset, or undefined if not found
 *
 * @remarks
 * The function matches filenames by comparing the last path component.
 * Supports both bare IDs and filenames with extensions.
 *
 * @example
 * getImageUrl('shapes') // Returns URL for @/assets/images/shapes.jpg
 * getImageUrl('shapes.jpg') // Also returns URL for @/assets/images/shapes.jpg
 */
function getImageUrl(filename: string | undefined): string | undefined {
  if (!filename) return undefined;
  const justName = filename.split('/').pop();
  for (const path in images) {
    if (path.endsWith(justName!)) {
      return images[path] as string;
    }
  }
  return undefined;
}

/**
 * Props for the ArticleRenderer component
 */
interface ArticleRendererProps {
  /** JSON string representation of article blocks to render */
  content?: string;
}

/**
 * ArticleRenderer component renders article blocks with appropriate styling and behavior.
 *
 * Parses a JSON string of article blocks and renders them with rich formatting,
 * mathematical equations, images, and interactive demonstrations.
 *
 * @param props - Component props
 * @param props.content - JSON string of article blocks (parsed from Article.content)
 * @returns Rendered article content with all block types formatted appropriately
 *
 * @remarks
 * - Parsing is memoized for performance; only re-parses when content changes
 * - Invalid JSON is silently handled; renders an empty container
 * - Images are resolved from the @/assets/images directory at render time
 * - Demos are matched against the registered demo components; unknown demos show an error
 *
 * @example
 * const { data: article } = useArticles({ articleId: 42 });
 * return <ArticleRenderer content={article.content} />;
 */
export const ArticleRenderer = ({ content }: ArticleRendererProps) => {
  // Parse blocks from JSON string, memoized for performance
  const blocks = useMemo(() => {
    try {
      return JSON.parse(content || '[]') as ArticleBlock[];
    } catch {
      return [];
    }
  }, [content]);

  return (
    <div className="article-content mx-auto max-w-3xl overflow-x-hidden px-4 pb-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          // Render headers with appropriate levels and styles
          case 'header': {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return React.createElement(
              Tag,
              {
                key: i,
                className: `mt-6 mb-4 font-bold sm:mt-8 ${
                  block.level === 1
                    ? 'text-2xl sm:text-3xl md:text-4xl'
                    : block.level === 2
                      ? 'text-xl sm:text-2xl md:text-3xl'
                      : block.level === 3
                        ? 'text-lg sm:text-xl md:text-2xl'
                        : 'text-base sm:text-lg'
                }`,
              },
              block.content,
            );
          }

          // Render paragraphs with markdown support
          case 'paragraph':
            return (
              <div
                key={i}
                className="mb-4 text-base leading-relaxed sm:text-lg"
              >
                <ReactMarkdown
                  components={{
                    li: ({ children }) => (
                      <li className="mb-2 list-disc pl-2">{children}</li>
                    ),
                    ul: ({ children }) => (
                      <ul className="ml-4 sm:ml-6">{children}</ul>
                    ),
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            );

          // Render code blocks with syntax highlighting
          case 'code':
            return (
              <pre
                key={i}
                className="mb-4 max-w-full overflow-x-auto rounded bg-neutral-950 p-3 text-xs sm:p-4 sm:text-sm"
              >
                <code className={`language-${block.language}`}>
                  {block.content}
                </code>
              </pre>
            );

          // Render notes with different styles based on note type
          case 'note':
            return (
              <div
                key={i}
                className={`mb-4 rounded border-l-4 p-4 ${
                  block.style === 'info'
                    ? 'border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    : block.style === 'warning'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                      : block.style === 'error'
                        ? 'border-red-400 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                        : 'border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}
              >
                {block.content}
              </div>
            );

          // Render figures with images and captions
          case 'figure': {
            // Resolve image URL from filename
            const imageUrl = getImageUrl(block.src) ?? block.src;
            return (
              <figure key={i} className="mb-4 flex flex-col items-center pt-4">
                <img
                  src={imageUrl}
                  alt={block.caption || 'Figure'}
                  className="h-auto max-h-[60vh] w-full max-w-full rounded object-contain shadow md:max-h-[400px] md:max-w-[600px]"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-sm text-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          // Render mathematical equations using KaTeX
          case 'equation':
            return (
              <div
                key={i}
                className="mb-4 flex max-w-full flex-col items-center rounded border-l-4 border-green-400 bg-neutral-100 p-4 font-mono text-green-800 dark:bg-neutral-900 dark:text-green-200"
              >
                <div className="max-w-full overflow-x-auto">
                  <BlockMath math={block.content} />
                </div>
                {block.caption && (
                  <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {block.caption}
                  </div>
                )}
              </div>
            );

          // Render interactive demos based on demo type
          case 'demo': {
            const DemoComponent = demoRegistry[block.demoType];
            if (!DemoComponent) {
              return (
                <div
                  key={i}
                  className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700"
                  role="alert"
                >
                  <strong>Demo not available:</strong> "{block.demoType}" is not
                  registered.
                </div>
              );
            }
            // Resolve image ID to actual image URL
            const imageSrc = block.src ? getImageUrl(block.src) : undefined;
            // Render demo with resolved image and additional args
            return (
              <div key={i} className="mb-4">
                <DemoComponent imageSrc={imageSrc} {...(block.args ?? {})} />
              </div>
            );
          }

          // Render lists as ordered or unordered
          case 'list':
            return block.ordered ? (
              <ol key={i} className="mb-4 ml-6 list-decimal">
                {block.items.map((item: string, idx: number) => (
                  <li key={idx} className="mb-2">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="mb-4 ml-6 list-disc">
                {block.items.map((item: string, idx: number) => (
                  <li key={idx} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'tabs': {
            const tabs = block.tabs.map((tab) => ({
              value: tab.value,
              label: tab.label,
              description: tab.description,
              content: (
                <ArticleRenderer
                  // Render nested blocks for each tab
                  content={JSON.stringify(tab.blocks ?? [])}
                />
              ),
            }));

            return (
              <div key={i} className="mb-6">
                <TabContainer tabs={tabs} defaultValue={block.defaultValue} />
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
};
