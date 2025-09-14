import * as React from 'react';

export type FooterProps = React.HTMLAttributes<HTMLElement> & {
  content?: string;
};

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ content = 'EdNotes', className, ...props }, ref) => (
    <footer
      ref={ref}
      className={`flex h-14 items-center border-t border-neutral-700 bg-neutral-900 px-4 ${className ?? ''}`}
      {...props}
    >
      <p className="text-sm text-neutral-400">{content}</p>
    </footer>
  ),
);

Footer.displayName = 'Footer';
