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
      content: any;
      type: 'figure';
      src: string;
      caption?: string;
    }
  | {
      caption: any;
      type: 'equation';
      content: string;
    }
  | {
      type: 'list';
      ordered: boolean;
      items: string[];
    }
  | {
      args: {};
      type: 'demo';
      demoType: string;
      imageId?: string; // Optional image resource ID for demos that need an image
    }
  | {
      upload: boolean;
      type: 'imageResource';
      id: string;
      src: string;
      alt?: string;
    };
