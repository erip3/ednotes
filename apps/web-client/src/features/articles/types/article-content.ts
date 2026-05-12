/**
 * @module features/articles/types/article-content
 * @description Type describing all supported article block shapes
 * rendered by the `ArticleRenderer` component. Each block includes a `type`
 * discriminator and fields for content and presentation.
 *
 * Supported blocks:
 * - `header`: Section headings with levels 1–6
 * - `paragraph`: Markdown-capable text content
 * - `code`: Code snippet with language identifier
 * - `note`: Callout boxes (info, warning, success, error)
 * - `figure`: Image with optional caption
 * - `equation`: KaTeX math with optional caption
 * - `list`: Ordered or unordered list of items
 * - `demo`: Interactive demo block with optional image resource
 *
 * @example
 * const blocks: ArticleBlock[] = [
 *   { type: 'header', level: 1, content: 'Title' },
 *   { type: 'paragraph', content: 'Intro paragraph with **markdown**.' },
 *   { type: 'code', language: 'ts', content: 'const x = 42' },
 *   { type: 'note', style: 'info', content: 'Useful tip.' },
 *   { type: 'figure', src: '/images/example.png', caption: 'Figure 1' },
 *   { type: 'equation', content: 'E = mc^2', caption: 'Mass-energy' },
 *   { type: 'list', ordered: false, items: ['Alpha', 'Beta'] },
 * ];
 */
export type ArticleBlock =
  /** Heading block for section titles */
  | {
      type: 'header';
      level: 1 | 2 | 3 | 4 | 5 | 6;
      content: string;
    }
  /** Paragraph block supporting inline markdown */
  | {
      type: 'paragraph';
      content: string;
    }
  /** Code block with language identifier (e.g., 'ts', 'tsx', 'js') */
  | {
      type: 'code';
      language: string;
      content: string;
    }
  /**
   * Note/callout block for contextual messages.
   * `style` controls the visual variant (info, warning, success, error).
   */
  | {
      type: 'note';
      style: 'info' | 'warning' | 'success' | 'error';
      content: string;
    }
  /** Figure block rendering an image with optional caption */
  | {
      type: 'figure';
      src: string;
      caption?: string;
    }
  /** Equation block rendered with KaTeX; optional caption */
  | {
      type: 'equation';
      content: string;
      caption?: string;
    }
  /** List block; ordered or unordered items */
  | {
      type: 'list';
      ordered: boolean;
      items: string[];
    }
  /**
   * Tabs block using the shared TabContainer component.
   * Each tab supplies a label and a nested set of article blocks rendered with ArticleRenderer.
   */
  | {
      type: 'tabs';
      defaultValue?: string;
      tabs: Array<{
        value: string;
        label: string;
        description?: string;
        blocks: ArticleBlock[];
      }>;
    }
  /**
   * Demo block embedding interactive components.
   * `demoType` selects the demo; `src` references an image resource.
   */
  | {
      args: {};
      type: 'demo';
      demoType: string;
      src?: string; // Optional image resource for demos that need an image
    };
