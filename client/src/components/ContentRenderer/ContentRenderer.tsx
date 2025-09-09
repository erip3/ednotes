import React, { useState, type JSX } from "react";
import type { ArticleBlock } from "./article";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import BubbleSortDemo from "../../demos/BubbleSortDemo";
import ImageTo3DSurface from "../../demos/ImageSurface";
import ImageResource from "./ImageResource";

// Props for demo components
type DemoComponentProps = {
  imageSrc?: string;
};

// Registry of demo components
const demoRegistry: Record<string, React.ComponentType<DemoComponentProps>> = {
  bubbleSort: BubbleSortDemo,
  imageToSurface: ImageTo3DSurface,
};

// Props for ContentRenderer component
interface ContentRendererProps {
  blocks: ArticleBlock[];
}

/**
 * ContentRenderer component renders article blocks with appropriate styling and behavior.
 * @param ContentRendererProps - Props for the component
 * @returns JSX.Element
 */
export default function ContentRenderer({ blocks }: ContentRendererProps) {
  // Map of image IDs to sources
  const initialImages: Record<string, string> = {};

  // Initialize image resources from blocks
  blocks.forEach((block) => {
    if (block.type === "imageResource" && block.id) {
      initialImages[block.id] = block.src;
    }
  });

  // State for image resources
  const [imageResources, setImageResources] = useState(initialImages);

  // Handler to update an image resource
  function handleUpdateImage(id: string, newSrc: string) {
    setImageResources((prev) => ({ ...prev, [id]: newSrc }));
  }

  return (
    <div className="article-content mx-auto max-w-3xl px-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header": {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return React.createElement(
              Tag,
              {
                key: i,
                className: `mt-8 mb-4 font-bold ${
                  block.level === 1
                    ? "text-3xl"
                    : block.level === 2
                    ? "text-2xl"
                    : block.level === 3
                    ? "text-xl"
                    : "text-lg"
                }`,
              },
              block.content
            );
          }

          case "paragraph":
            return (
              <p key={i} className="mb-4 text-lg leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: React.Fragment, // Prevent extra <p> inside <p>
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </p>
            );

          case "code":
            return (
              <pre
                key={i}
                className="mb-4 bg-neutral-950 rounded p-4 overflow-x-auto text-sm"
              >
                <code className={`language-${block.language}`}>
                  {block.content}
                </code>
              </pre>
            );

          case "note":
            return (
              <div
                key={i}
                className={`mb-4 p-4 rounded border-l-4 ${
                  block.style === "info"
                    ? "bg-blue-50 border-blue-400 text-blue-800"
                    : block.style === "warning"
                    ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                    : block.style === "error"
                    ? "bg-red-50 border-red-400 text-red-800"
                    : "bg-gray-50 border-gray-400 text-gray-800"
                }`}
              >
                {block.content}
              </div>
            );

          case "figure":
            return (
              <figure key={i} className="mb-4 flex flex-col items-center">
                <img
                  src={block.src}
                  alt={block.caption}
                  className="max-w-full rounded shadow"
                />
                <figcaption className="mt-2 text-sm text-gray-500">
                  {block.caption}
                </figcaption>
              </figure>
            );

          case "equation":
            return (
              <div
                key={i}
                className="mb-4 p-4 bg-neutral-100 border-l-4 border-green-400 text-green-800 rounded font-mono"
              >
                <BlockMath math={block.content} />
              </div>
            );

          case "imageResource":
            return (
              <ImageResource
                key={block.id}
                id={block.id}
                src={imageResources[block.id]}
                alt={block.alt}
                onUpdate={handleUpdateImage}
              />
            );

          case "demo": {
            const DemoComponent = demoRegistry[block.demoType];
            if (!DemoComponent) {
              return (
                <div
                  key={i}
                  className="mb-4 p-4 bg-red-100 text-red-700 rounded"
                >
                  Demo "{block.demoType}" not found.
                </div>
              );
            }
            let imageSrc: string | undefined = undefined;
            if ("imageId" in block && block.imageId) {
              imageSrc = imageResources[block.imageId];
            } else {
              const imageResourceIds = Object.keys(imageResources);
              imageSrc =
                imageResourceIds.length > 0
                  ? imageResources[imageResourceIds[0]]
                  : undefined;
            }
            return (
              <div key={i} className="mb-4">
                <DemoComponent imageSrc={imageSrc} />
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
