/**
 * HomeIcon component renders a home icon SVG.
 * @returns JSX.Element
 */
export default function HomeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-icon, currentColor)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
    >
      <path d="M3 12L12 4L21 12Z" />
      <rect x="6" y="12" width="12" height="8" />
      <rect x="11" y="16" width="2" height="4" />
    </svg>
  );
}
