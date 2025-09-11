export default function NotesIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Notebook outline */}
      <rect
        x="3"
        y="3"
        width="15"
        height="18"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Notebook lines */}
      <line x1="7" y1="7" x2="14" y2="7" />
      <line x1="7" y1="11" x2="14" y2="11" />
      <line x1="7" y1="15" x2="11" y2="15" />
    </svg>
  );
}
