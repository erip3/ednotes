import React, { useMemo } from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";

// Basic JSON Schema describing the ArticleBlock[] structure, including tabs
const ARTICLE_SCHEMA_URI = "inmemory://models/article-schema.json";
const ARTICLE_SCHEMA = {
  $id: ARTICLE_SCHEMA_URI,
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "array",
  title: "Article content blocks",
  items: {
    oneOf: [
      {
        type: "object",
        required: ["type", "level", "content"],
        properties: {
          type: { const: "header" },
          level: { enum: [1, 2, 3, 4, 5, 6] },
          content: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "content"],
        properties: {
          type: { const: "paragraph" },
          content: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "language", "content"],
        properties: {
          type: { const: "code" },
          language: { type: "string" },
          content: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "style", "content"],
        properties: {
          type: { const: "note" },
          style: { enum: ["info", "warning", "success", "error"] },
          content: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "src"],
        properties: {
          type: { const: "figure" },
          src: { type: "string" },
          caption: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "content"],
        properties: {
          type: { const: "equation" },
          content: { type: "string" },
          caption: { type: "string" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "ordered", "items"],
        properties: {
          type: { const: "list" },
          ordered: { type: "boolean" },
          items: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "demoType"],
        properties: {
          type: { const: "demo" },
          demoType: { type: "string" },
          src: { type: "string" },
          args: { type: "object" },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        required: ["type", "tabs"],
        properties: {
          type: { const: "tabs" },
          defaultValue: { type: "string" },
          tabs: {
            type: "array",
            items: {
              type: "object",
              required: ["value", "label", "blocks"],
              properties: {
                value: { type: "string" },
                label: { type: "string" },
                description: { type: "string" },
                blocks: { $ref: ARTICLE_SCHEMA_URI },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
} as const;

export type JsonEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onValidJson?: (parsed: unknown) => void;
  className?: string;
};

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  onValidJson,
  className,
}) => {
  const handleChange: OnChange = (val) => {
    const v = val ?? "";
    onChange(v);
    try {
      const parsed = JSON.parse(v);
      onValidJson?.(parsed);
    } catch {
      // ignore parse errors during typing
    }
  };

  const handleMount: OnMount = (editor, monaco) => {
    // JSON diagnostics and schema
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      enableSchemaRequest: false,
      schemas: [
        {
          uri: ARTICLE_SCHEMA_URI,
          fileMatch: ["*"],
          schema: ARTICLE_SCHEMA as any,
        },
      ],
    });
    // Editor commands: format on initialization
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 0);
  };

  const options = useMemo(
    () => ({
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: false,
      formatOnType: false,
      wordWrap: "on" as const,
    }),
    []
  );

  return (
    <div className={className} style={{ height: "100%" }}>
      <Editor
        height="100%"
        defaultLanguage="json"
        language="json"
        theme="vs-dark"
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        options={options}
      />
    </div>
  );
};
