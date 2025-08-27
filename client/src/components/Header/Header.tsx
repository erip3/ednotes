import HomeButton from "./HomeButton";
import styles from "./Header.module.css";

/**
 * Header component displays the top navigation bar.
 * @returns JSX.Element
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <HomeButton />
    </header>
  );
}
