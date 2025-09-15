import { HomeIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

import { Button } from '../button/button';

export type HeaderProps = {
  onHome?: () => void;
  onBack?: () => void;
};

/**
 * Header component that displays navigation buttons.
 * @param props - Props including onHome and onBack handlers.
 * @returns A styled header component.
 */
export const Header = ({ onHome, onBack }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center border-b bg-background px-4">
      <div className="flex gap-x-2">
        <Button
          variant="ghost"
          size="icon"
          icon={<ArrowLeftIcon />}
          onClick={onBack}
        />
        <Button
          variant="ghost"
          size="icon"
          icon={<HomeIcon />}
          onClick={onHome}
        />
      </div>
    </header>
  );
};
