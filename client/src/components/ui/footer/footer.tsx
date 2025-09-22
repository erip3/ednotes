import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '../button/button';

export type FooterProps = React.HTMLAttributes<HTMLElement> & {
  content?: string;
};

/**
 * Footer component that displays social media links and custom content.
 * @param props - Props including content and other HTML attributes.
 * @returns A styled footer component.
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ content = 'EdNotes', className, ...props }, ref) => (
    <footer
      ref={ref}
      className={`flex min-h-28 w-full flex-col items-center justify-center border-t bg-primary px-4 py-4 ${className ?? ''}`}
      {...props}
    >
      <p className="mb-2 max-w-full truncate break-words text-center font-medium text-secondary-foreground">
        {content}
      </p>
      <div className="flex space-x-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="GitHub"
          onClick={() => window.open('https://github.com/erip3', '_blank')}
        >
          <GitHubLogoIcon width={28} height={28} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="LinkedIn"
          onClick={() =>
            window.open(
              'https://www.linkedin.com/in/eddie-ripple-96068826b/',
              '_blank',
            )
          }
        >
          <LinkedInLogoIcon width={28} height={28} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Email"
          onClick={() => window.open('mailto:edrip222@gmail.com', '_blank')}
        >
          <EnvelopeClosedIcon width={28} height={28} />
        </Button>
      </div>
      <div>
        <span className="mt-2 text-sm text-secondary-foreground">
          edrip222@gmail.com
        </span>
      </div>
    </footer>
  ),
);

Footer.displayName = 'Footer';
