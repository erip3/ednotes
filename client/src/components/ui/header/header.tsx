import { HomeIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

import { Button } from '../button/button';

export type HeaderProps = {
  onHome?: () => void;
  onBack?: () => void;
};

export const Header = ({ onHome, onBack }: HeaderProps) => {
  return (
    <header className="flex h-14 items-center border bg-background px-4">
      <Button
        variant="ghost"
        icon={<ArrowLeftIcon />}
        onClick={onBack}
      ></Button>
      <Button variant="ghost" icon={<HomeIcon />} onClick={onHome}></Button>
    </header>
  );
};
