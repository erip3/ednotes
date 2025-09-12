export type ArticleBlock =
  | {
      type: 'header';
      level: 1 | 2 | 3 | 4 | 5 | 6;
      content: string;
    }
  | {
      type: 'paragraph';
      content: string;
    }
  | {
      type: 'code';
      language: string;
      content: string;
    }
  | {
      type: 'note';
      style: 'info' | 'warning' | 'success' | 'error';
      content: string;
    }
  | {
      type: 'figure';
      src: string;
      caption?: string;
    }
  | {
      type: 'equation';
      content: string; // could later refine to a MathJax/LaTeX AST
    }
  | {
      type: 'demo';
      demoType: string;
      imageId?: string; // ID of the associated image resource
    }
  | {
      type: 'imageResource';
      id: string;
      src: string;
      alt?: string;
    };
