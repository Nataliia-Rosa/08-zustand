import Link from "next/link";
import css from "./Home.module.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: 'Not Found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist.',
    url: 'https://example.com/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
