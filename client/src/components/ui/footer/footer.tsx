/**
 * @module components/ui/footer
 * @description Provides a consistent footer across the application with social media buttons,
 * content display, and contact information. Uses React.forwardRef for ref forwarding.
 *
 * Functionality:
 * - **Links**: GitHub, LinkedIn, and email buttons that open in new tabs
 * - **Ref forwarding**: Supports ref forwarding via React.forwardRef
 * - **Responsive**: Flexbox layout with proper spacing and alignment
 *
 * @example
 * // Default usage
 * <Footer />
 *
 * @example
 * // With custom content
 * <Footer content="© 2025 EdNotes. All rights reserved." />
 *
 * @example
 * // With ref forwarding
 * const footerRef = useRef<HTMLElement>(null);
 * <Footer ref={footerRef} content="Custom footer text" />
 */

import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '../button/button';

/**
 * Props for the Footer component.
 *
 * @remarks
 * Extends standard HTML footer element attributes, allowing all native props
 * like className, id, onClick, etc. to be passed through.
 */
export type FooterProps = React.HTMLAttributes<HTMLElement> & {
  /** Whether the component is rendered on an article page. */
  isArticle?: boolean;
  /** Whether the article is published (defaults to true). If false, shows draft message. */
  articlePublished?: boolean;
};

/**
 * Footer messages displayed based on article published status
 * @const
 */
const FOOTER_MESSAGES = {
  published:
    'These are my notes, so they could contain inaccuracies. If you find an error or have any suggestions, send me an email',
  draft:
    "This article is a work in progress, so it's probably incomplete and could contain errors.",
} as const;

/**
 * Footer component with social media links and contact information.
 *
 * All external links open in new tabs using `window.open` with `_blank` target.
 * Icon buttons include descriptive aria-labels for screen reader accessibility.
 * The component uses React.forwardRef to allow parent components to access
 * the underlying footer DOM element.
 *
 * Content behavior:
 * - Displays published or draft message based on articlePublished prop
 * - Small screens (<sm): Shows "EdNotes" or "draft" in warning color
 * - Larger screens (sm+): Shows full message text from FOOTER_MESSAGES
 *
 * @param {FooterProps} props - Footer configuration with articlePublished status and HTML attributes.
 * @param {React.Ref<HTMLElement>} ref - Optional ref forwarded to footer element.
 * @returns {JSX.Element} Footer with social links, message, and contact information.
 *
 * @remarks
 * - Content text uses `truncate` and `break-words` to prevent overflow issues
 * - Two text elements shown based on screen size (responsive via Tailwind)
 * - Draft status shows as "draft" in warning color on small screens
 * - Social buttons use ghost variant for minimal visual weight
 * - Email button opens default mail client with `mailto:` protocol
 * - The footer has `min-h-28` (112px) to ensure consistent height
 * - All native HTML footer attributes are supported via spread operator
 *
 * @example
 * // Published article
 * <Footer articlePublished={true} />
 *
 * @example
 * // Draft article
 * <Footer articlePublished={false} />
 *
 * @example
 * // With ref forwarding for scroll positioning
 * const footerRef = useRef<HTMLElement>(null);
 * const scrollToFooter = () => footerRef.current?.scrollIntoView();
 * <Footer ref={footerRef} articlePublished={isPublished} />
 *
 * @example
 * // With additional HTML attributes
 * <Footer
 *   articlePublished={article.published}
 *   className="custom-footer-class"
 *   id="main-footer"
 * />
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    { articlePublished = true, isArticle = false, className, ...props },
    ref,
  ) => {
    const message = articlePublished
      ? FOOTER_MESSAGES.published
      : FOOTER_MESSAGES.draft;

    return (
      <footer
        ref={ref}
        className={`flex min-h-28 w-full flex-col items-center justify-center border-t border-marginal-border bg-marginal-background px-4 py-4 ${className ?? ''}`}
        {...props}
      >
        <p className="mb-2 hidden max-w-full truncate break-words text-center font-medium text-foreground sm:block">
          {isArticle ? message : 'EdNotes'}
        </p>
        <p
          className={`mb-2 max-w-full truncate break-words text-center text-sm font-medium sm:hidden ${
            isArticle && !articlePublished
              ? 'text-warning-foreground'
              : 'text-foreground'
          }`}
        >
          {isArticle ? (!articlePublished ? 'Draft' : 'EdNotes') : 'EdNotes'}
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
          <span className="mt-2 text-sm text-foreground">
            edrip222@gmail.com
          </span>
        </div>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
