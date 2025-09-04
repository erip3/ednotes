import React, { type JSX } from "react";
import type { ArticleBlock } from "./article";

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
                }`
              },
              block.content
            );
          }
          case "paragraph":
            return (
              <p key={i} className="mb-4 text-base leading-relaxed">
                {block.content}
              </p>
            );
          case "code":
            return (
              <pre
                key={i}
                className="mb-4 bg-gray-100 rounded p-4 overflow-x-auto text-sm"
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
                className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded font-mono"
              >
                {block.content}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
