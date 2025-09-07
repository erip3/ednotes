import BackButton from "./BackButton";
import HomeButton from "./HomeButton";

/**
 * Header component displays the top navigation bar.
 * @returns JSX.Element
 */
export default function Header() {
  return (
    <header className="flex items-center h-14 px-4 bg-neutral-900 border-b border-neutral-700">
      <BackButton />
      <HomeButton />
    </header>
  );
}
