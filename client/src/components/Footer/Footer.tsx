import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  let content: React.ReactNode = null;

  if (location.pathname === '/') {
    content = (
      <span className="text-sm text-gray-500">Welcome to EdNotes Home!</span>
    );
  } else if (location.pathname.startsWith('/category')) {
    content = (
      <span className="text-sm text-gray-500">Browsing a category page.</span>
    );
  } else if (location.pathname.startsWith('/article')) {
    content = (
      <span className="text-sm text-gray-500">Reading an article.</span>
    );
  } else if (location.pathname === '/personal') {
    content = (
      <span className="text-sm text-gray-500">This is your personal page.</span>
    );
  } else {
    content = (
      <span className="text-sm text-gray-500">
        Thanks for visiting EdNotes!
      </span>
    );
  }

  return (
    <footer className="mt-8 flex w-full items-center justify-center border-t border-neutral-800 bg-neutral-900 py-4">
      {content}
    </footer>
  );
}
