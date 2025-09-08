import React, { type JSX } from "react";
import type { ArticleBlock } from "./article";
import BubbleSortDemo from "../../demos/BubbleSortDemo";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";

const demoRegistry: Record<string, React.ComponentType> = {
  bubbleSort: BubbleSortDemo,
  // quickSort: QuickSortDemo,
  // ...add more demos here
};

interface ContentRendererProps {
  blocks: ArticleBlock[];
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
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
            return (
              <div key={i} className="mb-4">
                <DemoComponent />
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
