import React, { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import type { ArticleBlock } from "@/features/articles/types/article-content";
import type { Category } from "@/types/aliases";

import { useCategories } from "../hooks/use-categories";
import { JsonEditor } from "./json-editor";

interface EditorProps {
  blocks: ArticleBlock[];
  metadata: { title: string; description: string; parentId?: number | null };
  onBlocksChange: (blocks: ArticleBlock[]) => void;
  onMetadataChange: (
    field: "title" | "description" | "parentId",
    value: string | number | null
  ) => void;
}

export const Editor: React.FC<EditorProps> = ({
  blocks,
  metadata,
  onBlocksChange,
  onMetadataChange,
}) => {
  const [jsonView, setJsonView] = useState(false);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(blocks, null, 2));
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);

  // Recursively flatten all blocks with their paths
  type FlatBlock = {
    block: ArticleBlock;
    path: number[];
    label: string;
  };

  const flattenBlocks = (
    blocks: ArticleBlock[],
    parentPath: number[] = []
  ): FlatBlock[] => {
    const result: FlatBlock[] = [];
    blocks.forEach((block, idx) => {
      const path = [...parentPath, idx];
      const depth = parentPath.length;
      const indent = "  ".repeat(depth);
      let label = `${indent}${path.join(".")}: ${block.type}`;

      if (block.type === "header") label += ` (h${block.level})`;
      if (block.type === "note") label += ` (${block.style})`;
      if (block.type === "code") label += ` (${block.language})`;
      if (block.type === "tabs") label += ` (${block.tabs.length} tabs)`;

      result.push({ block, path, label });

      // Recurse into tabs
      if (block.type === "tabs") {
        block.tabs.forEach((tab, tabIdx) => {
          const tabPath = [...path, tabIdx];
          const tabIndent = "  ".repeat(depth + 1);
          result.push({
            block: { type: "paragraph", content: "" } as any,
            path: tabPath,
            label: `${tabIndent}↳ Tab: ${tab.label}`,
          });
          if (tab.blocks?.length) {
            result.push(...flattenBlocks(tab.blocks, tabPath));
          }
        });
      }
    });
    return result;
  };

  const allBlocks = flattenBlocks(blocks);
  // Keep JSON editor in sync when blocks change externally (e.g., load by ID)
  // but do NOT overwrite while user is editing in JSON view to avoid cursor jumps
  useEffect(() => {
    if (!jsonView) {
      setJsonInput(JSON.stringify(blocks, null, 2));
    }
  }, [blocks, jsonView]);
  const {
    topCategories,
    children,
    status,
    childStatus,
    path,
    selectTop,
    selectChild,
    goUp,
    reset,
  } = useCategories();

  const handleTopSelect = (id: number | null) => {
    selectTop(id);
    onMetadataChange("parentId", id);
  };

  const handleChildSelect = (id: number | null) => {
    if (id == null) return;
    selectChild(id);
    onMetadataChange("parentId", id);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      onBlocksChange(parsed);
    } catch {
      // Invalid JSON, don't update until valid
    }
  };

  const addBlock = (type: ArticleBlock["type"]) => {
    let newBlock: ArticleBlock;
    switch (type) {
      case "header":
        newBlock = { type: "header", level: 2, content: "New Section" };
        break;
      case "paragraph":
        newBlock = {
          type: "paragraph",
          content: "Enter paragraph text here...",
        };
        break;
      case "code":
        newBlock = {
          type: "code",
          language: "javascript",
          content: 'console.log("Hello");',
        };
        break;
      case "equation":
        newBlock = {
          type: "equation",
          content: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        };
        break;
      case "figure":
        newBlock = {
          type: "figure",
          src: "image.jpg",
          caption: "Figure caption",
        };
        break;
      case "note":
        newBlock = { type: "note", style: "info", content: "Note content" };
        break;
      case "demo":
        newBlock = { type: "demo", demoType: "bubbleSort", args: {} };
        break;
      case "list":
        newBlock = {
          type: "list",
          ordered: false,
          items: ["Item 1", "Item 2"],
        };
        break;
      case "tabs":
        newBlock = {
          type: "tabs",
          defaultValue: "tab-1",
          tabs: [
            {
              value: "tab-1",
              label: "Tab 1",
              description: "Example tab",
              blocks: [{ type: "paragraph", content: "Tab 1 content" }],
            },
            {
              value: "tab-2",
              label: "Tab 2",
              description: "Another tab",
              blocks: [{ type: "paragraph", content: "Tab 2 content" }],
            },
          ],
        };
        break;
      default:
        return;
    }
    const updated = [...blocks, newBlock];
    onBlocksChange(updated);
    setJsonInput(JSON.stringify(updated, null, 2));
  };

  const deleteBlock = (path: number[]) => {
    if (path.length === 1) {
      // Top-level block
      const updated = blocks.filter((_, i) => i !== path[0]);
      onBlocksChange(updated);
      setJsonInput(JSON.stringify(updated, null, 2));
    } else {
      // Nested in tabs
      const updated = JSON.parse(JSON.stringify(blocks)); // deep clone
      const [topIdx, tabIdx, ...rest] = path;
      if (rest.length === 0) {
        // Remove tab itself
        updated[topIdx].tabs.splice(tabIdx, 1);
      } else {
        // Remove block inside tab
        const tab = updated[topIdx].tabs[tabIdx];
        tab.blocks.splice(rest[0], 1);
      }
      onBlocksChange(updated);
      setJsonInput(JSON.stringify(updated, null, 2));
    }
    if (selectedPath && JSON.stringify(selectedPath) === JSON.stringify(path)) {
      setSelectedPath(null);
    }
  };

  const updateBlock = (path: number[], next: Partial<ArticleBlock>) => {
    const updated = JSON.parse(JSON.stringify(blocks)); // deep clone
    if (path.length === 1) {
      // Top-level block
      updated[path[0]] = { ...updated[path[0]], ...next };
    } else {
      // Nested in tabs
      const [topIdx, tabIdx, blockIdx] = path;
      const tab = updated[topIdx].tabs[tabIdx];
      tab.blocks[blockIdx] = { ...tab.blocks[blockIdx], ...next };
    }
    onBlocksChange(updated);
    setJsonInput(JSON.stringify(updated, null, 2));
  };

  const getBlockAtPath = (path: number[]): ArticleBlock | null => {
    if (path.length === 1) return blocks[path[0]] ?? null;
    const [topIdx, tabIdx, blockIdx] = path;
    if (path.length === 3) {
      return blocks[topIdx]?.type === "tabs"
        ? (blocks[topIdx] as any).tabs[tabIdx]?.blocks[blockIdx] ?? null
        : null;
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-background p-6">
      {/* Metadata Section */}
      <div className="mb-6 rounded-lg bg-primary-background p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-foreground">Metadata</h2>
        <input
          type="text"
          placeholder="Article Title"
          value={metadata.title}
          onChange={(e) => onMetadataChange("title", e.target.value)}
          className="mb-3 w-full rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <textarea
          placeholder="Article Description"
          value={metadata.description}
          onChange={(e) => onMetadataChange("description", e.target.value)}
          className="w-full rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
          rows={2}
        />

        {/* Category Selector */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Category</p>
          <div className="flex gap-2 items-center">
            <select
              className="flex-1 rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
              value={path[0]?.id ?? ""}
              onChange={(e) =>
                handleTopSelect(e.target.value ? Number(e.target.value) : null)
              }
              disabled={status === "loading"}
            >
              <option value="">Select top-level</option>
              {topCategories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!path.length}
              onClick={() =>
                onMetadataChange("parentId", path[path.length - 1]?.id ?? null)
              }
              className="rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
            >
              Use current level
            </button>
          </div>
          {path.length > 1 && (
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={goUp}
                className="rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
              >
                Back one level
              </button>
              <button
                type="button"
                onClick={() => {
                  const topId = path[0]?.id ?? null;
                  handleTopSelect(topId);
                  onMetadataChange("parentId", topId);
                }}
                className="rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
              >
                Back to top-level
              </button>
            </div>
          )}
          {childStatus === "loading" && (
            <p className="text-xs text-muted-foreground">
              Loading subcategories...
            </p>
          )}
          {children.length > 0 && (
            <div className="flex gap-2 items-center">
              <select
                className="flex-1 rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
                value=""
                onChange={(e) =>
                  handleChildSelect(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">Select subcategory or drill deeper</option>
                {children.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Current parentId: {metadata.parentId ?? "none"}</p>
            {path.length > 0 && (
              <p>Path: {path.map((c) => c.title).join(" / ")}</p>
            )}
            {children.length === 0 && path.length > 0 && (
              <p>No more subcategories.</p>
            )}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setJsonView(false)}
          className={`rounded px-4 py-2 text-sm font-medium ${
            !jsonView
              ? "bg-blue-600 text-white"
              : "border border-muted-border bg-primary-background text-foreground"
          }`}
        >
          Visual Editor
        </button>
        <button
          onClick={() => setJsonView(true)}
          className={`rounded px-4 py-2 text-sm font-medium ${
            jsonView
              ? "bg-blue-600 text-white"
              : "border border-muted-border bg-primary-background text-foreground"
          }`}
        >
          JSON Editor
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {!jsonView ? (
          <div className="space-y-4">
            {/* Block List */}
            <div className="space-y-2 rounded-lg bg-primary-background p-4 shadow-sm">
              <h3 className="font-semibold text-foreground">Blocks</h3>
              {blocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No blocks yet. Add one below.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allBlocks.map(({ block, path, label }, idx) => {
                    const isTab = label.includes("↳ Tab:");
                    const isSelected =
                      selectedPath &&
                      JSON.stringify(selectedPath) === JSON.stringify(path);
                    return (
                      <div
                        key={`${path.join("-")}-${idx}`}
                        onClick={() => !isTab && setSelectedPath(path)}
                        className={`flex items-center justify-between rounded border bg-background p-3 ${
                          isTab
                            ? "bg-muted-background/50 cursor-default italic"
                            : "cursor-pointer hover:bg-muted-background/30"
                        } ${
                          isSelected
                            ? "border-blue-500 ring-1 ring-blue-300"
                            : "border-muted-border"
                        }`}
                      >
                        <span className="text-sm font-medium text-foreground font-mono whitespace-pre">
                          {label}
                        </span>
                        {!isTab && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlock(path);
                            }}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Type-specific editor for selected block */}
            {selectedPath != null &&
              (() => {
                const selectedBlock = getBlockAtPath(selectedPath);
                if (!selectedBlock) return null;
                return (
                  <div className="rounded-lg bg-primary-background p-4 shadow-sm">
                    <h3 className="mb-3 font-semibold text-foreground">
                      Edit Block {selectedPath.join(".")}
                    </h3>
                    {selectedBlock.type === "code" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-foreground">
                            Language
                          </label>
                          <select
                            className="rounded border border-muted-border bg-background px-3 py-2 text-sm text-foreground"
                            value={(selectedBlock as any).language}
                            onChange={(e) =>
                              updateBlock(selectedPath, {
                                type: "code",
                                language: e.target.value,
                              } as any)
                            }
                          >
                            <option value="javascript">javascript</option>
                            <option value="typescript">typescript</option>
                            <option value="tsx">tsx</option>
                            <option value="jsx">jsx</option>
                            <option value="json">json</option>
                            <option value="bash">bash</option>
                            <option value="python">python</option>
                            <option value="java">java</option>
                            <option value="c">c</option>
                            <option value="cpp">cpp</option>
                          </select>
                        </div>
                        <div className="h-64 border border-muted-border rounded">
                          <MonacoEditor
                            height="100%"
                            defaultLanguage={
                              (selectedBlock as any).language || "javascript"
                            }
                            language={
                              (selectedBlock as any).language || "javascript"
                            }
                            theme="vs-dark"
                            value={(selectedBlock as any).content || ""}
                            onChange={(val) =>
                              updateBlock(selectedPath, {
                                type: "code",
                                content: val ?? "",
                              } as any)
                            }
                            options={{
                              minimap: { enabled: false },
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              wordWrap: "on",
                              fontSize: 13,
                              tabSize: 2,
                              insertSpaces: true,
                              renderWhitespace: "selection",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select a code block to edit its content here.
                      </p>
                    )}
                  </div>
                );
              })()}

            {/* Add Block Buttons */}
            <div className="rounded-lg bg-primary-background p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-foreground">Add Block</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addBlock("header")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Header
                </button>
                <button
                  onClick={() => addBlock("paragraph")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Paragraph
                </button>
                <button
                  onClick={() => addBlock("code")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Code
                </button>
                <button
                  onClick={() => addBlock("equation")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Equation
                </button>
                <button
                  onClick={() => addBlock("figure")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Figure
                </button>
                <button
                  onClick={() => addBlock("note")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Note
                </button>
                <button
                  onClick={() => addBlock("demo")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Demo
                </button>
                <button
                  onClick={() => addBlock("list")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  List
                </button>
                <button
                  onClick={() => addBlock("tabs")}
                  className="rounded border border-muted-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:opacity-80"
                >
                  Tabs
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-primary-background p-4 shadow-sm h-full flex flex-col min-h-0">
            <h3 className="mb-2 font-semibold text-foreground">JSON Editor</h3>
            <div className="flex-1 min-h-0 border border-muted-border rounded">
              <JsonEditor
                value={jsonInput}
                onChange={(val) => setJsonInput(val)}
                onValidJson={(parsed) => {
                  if (Array.isArray(parsed)) {
                    onBlocksChange(parsed as ArticleBlock[]);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
