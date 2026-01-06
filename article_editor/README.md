# Article Editor

A local JSON editor for creating EdNotes articles with live preview.

## Features

- **Split-pane interface**: Edit on the left, preview on the right
- **Visual & JSON modes**: Toggle between intuitive UI or direct JSON editing
- **Live preview**: See rendered content in real-time using ArticleRenderer
- **Auto-save**: Drafts saved to browser localStorage every 10 seconds
- **Upload to database**: One-click button to save completed articles to the server
- **Block management**: Add, delete, and reorder article blocks

## Supported Block Types

- `header` - Markdown-style headers (h1-h6)
- `paragraph` - Text with markdown support
- `code` - Syntax-highlighted code blocks
- `equation` - LaTeX/KaTeX equations
- `figure` - Images with captions
- `note` - Styled callout boxes (info, warning, error)
- `demo` - Interactive demonstrations
- `list` - Ordered or unordered lists

## Getting Started

### Prerequisites

- Node.js 18+
- The server running on `http://localhost:8080`

### Installation

```bash
cd article_editor
npm install
```

### Development

```bash
npm run dev
```

The editor will open at `http://localhost:5174`

### Build

```bash
npm run build
```

## How It Works

1. **Create/Edit**: Use the left panel to add blocks or edit JSON directly
2. **Preview**: See rendered output on the right panel
3. **Auto-save**: Drafts are automatically saved to localStorage
4. **Upload**: Click "Upload to Database" when ready to save to the server

## Data Persistence

- Drafts are stored in browser localStorage under:
  - `article-draft-blocks` - Array of content blocks
  - `article-draft-metadata` - Title and description

## API Integration

The editor communicates with your backend API at:

- `POST /api/articles` - Create new article
- `GET /api/articles/{id}` - Fetch article
- `PUT /api/articles/{id}` - Update article

Ensure your server is running and CORS is configured appropriately.
