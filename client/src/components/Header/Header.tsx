import BackButton from './BackButton';
import HomeButton from './HomeButton';

/**
 * Header component displays the top navigation bar.
 * @returns JSX.Element
 */
export default function Header() {
  return (
    <header className="flex h-14 items-center border-b border-neutral-700 bg-neutral-900 px-4">
      <BackButton />
      <HomeButton />
    </header>
  );
}
