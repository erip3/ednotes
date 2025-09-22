import React, { useState, useMemo, type JSX } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';

import type { ArticleBlock } from '../types/article-content';

import { ImageResource } from './image-resource';

import { BubbleSortDemo } from '@/features/demos/bubble-sort';
import { ConvolutionDemo } from '@/features/demos/convolution';
import { DFADemo } from '@/features/demos/dfa';
import { ImageTo3DSurface } from '@/features/demos/image-surface';

// Registry of demo components
const demoRegistry: Record<string, React.ComponentType<any>> = {
  bubbleSort: BubbleSortDemo,
  imageToSurface: ImageTo3DSurface,
  convolution: ConvolutionDemo,
  dfa: DFADemo,
};

// Map filenames to imported images
const images = import.meta.glob('@/assets/images/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Helper to get image URL by filename
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

// Props for ArticleRenderer component
interface ArticleRendererProps {
  content?: string; // JSON string of blocks
}

/**
 * ArticleRenderer component renders article blocks with appropriate styling and behavior.
 * @param props - Props for the component
 * @returns JSX.Element
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

  // Map of image IDs to sources
  const initialImages: Record<string, string> = {};

  // Initialize image resources from blocks
  blocks.forEach((block) => {
    if (block.type === 'imageResource' && block.id) {
      // If src matches a known asset filename, use the imported asset
      initialImages[block.id] = getImageUrl(block.src) ?? block.src;
    }
  });

  // State for image resources
  const [imageResources, setImageResources] = useState(initialImages);

  // Handler to update an image resource
  function handleUpdateImage(id: string, newSrc: string) {
    setImageResources((prev) => ({ ...prev, [id]: newSrc }));
  }

  return (
    <div className="article-content mx-auto max-w-3xl px-4 pb-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          // Render headers with appropriate levels and styles
          case 'header': {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return React.createElement(
              Tag,
              {
                key: i,
                className: `mt-8 mb-4 font-bold ${
                  block.level === 1
                    ? 'text-3xl'
                    : block.level === 2
                      ? 'text-2xl'
                      : block.level === 3
                        ? 'text-xl'
                        : 'text-lg'
                }`,
              },
              block.content,
            );
          }

          // Render paragraphs with markdown support
          case 'paragraph':
            return (
              <div key={i} className="mb-4 text-lg leading-relaxed">
                <ReactMarkdown
                  components={{
                    li: ({ children }) => (
                      <li className="mb-2 list-disc pl-2">{children}</li>
                    ),
                    ul: ({ children }) => <ul className="ml-6">{children}</ul>,
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
                className="mb-4 overflow-x-auto rounded bg-neutral-950 p-4 text-sm"
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
                    ? 'border-blue-400 bg-blue-50 text-blue-800'
                    : block.style === 'warning'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                      : block.style === 'error'
                        ? 'border-red-400 bg-red-50 text-red-800'
                        : 'border-gray-400 bg-gray-50 text-gray-800'
                }`}
              >
                {block.content}
              </div>
            );

          // Render figures with images and captions
          case 'figure':
            // If figure has text content, render TODO in red
            if (block.content) {
              return (
                <div
                  key={i}
                  className="mb-4 rounded bg-red-100 p-4 font-bold text-red-700"
                >
                  TODO: {block.content}
                </div>
              );
            }
            // Otherwise, render the image and caption as before
            return (
              <figure key={i} className="mb-4 flex flex-col items-center">
                <img
                  src={getImageUrl(block.src) ?? block.src}
                  alt={block.caption}
                  className="max-w-full rounded shadow"
                  style={{
                    maxWidth: '600px',
                    maxHeight: '400px',
                    width: 'auto',
                    height: 'auto',
                  }}
                />
                <figcaption className="mt-2 text-sm text-gray-500">
                  {block.caption}
                </figcaption>
              </figure>
            );

          // Render mathematical equations using KaTeX
          case 'equation':
            return (
              <div
                key={i}
                className="mb-4 rounded border-l-4 border-green-400 bg-neutral-100 p-4 font-mono text-green-800"
              >
                <BlockMath math={block.content} />
              </div>
            );

          // Render image resources with upload capability
          case 'imageResource':
            return (
              <ImageResource
                key={block.id}
                id={block.id}
                src={imageResources[block.id]}
                alt={block.alt}
                onUpdate={handleUpdateImage}
                upload={block.upload !== false}
              />
            );

          // Render interactive demos based on demo type
          case 'demo': {
            const DemoComponent = demoRegistry[block.demoType];
            if (!DemoComponent) {
              return (
                <div
                  key={i}
                  className="mb-4 rounded bg-red-100 p-4 text-red-700"
                >
                  Demo "{block.demoType}" not found.
                </div>
              );
            }
            let imageSrc: string | undefined = undefined;
            if ('imageId' in block && block.imageId) {
              imageSrc = imageResources[block.imageId];
            } else {
              const imageResourceIds = Object.keys(imageResources);
              imageSrc =
                imageResourceIds.length > 0
                  ? imageResources[imageResourceIds[0]]
                  : undefined;
            }
            // Pass args as props
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
          default:
            return null;
        }
      })}
    </div>
  );
};
