import React, { type JSX } from "react";
import type { ArticleBlock } from "./article";

interface ContentRendererProps {
  blocks: ArticleBlock[];
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="article-content">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header": {
            const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
            return React.createElement(Tag, { key: i }, block.content);
          }
          case "paragraph":
            return <p key={i}>{block.content}</p>;
          case "code":
            return (
              <pre key={i}>
                <code className={`language-${block.language}`}>
                  {block.content}
                </code>
              </pre>
            );
          case "note":
            return (
              <div key={i} className={`note note-${block.style}`}>
                {block.content}
              </div>
            );
          case "figure":
            return (
              <figure key={i}>
                <img src={block.src} alt={block.caption} />
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          case "equation":
            return (
              <div key={i} className="equation">
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
