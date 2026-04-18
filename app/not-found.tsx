import { Metadata } from "next";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Notehub - Not found Page.",
  description: "It`s error page.",
  openGraph: {
    title: "Notehub - Not found Page.",
    description: "It`s error page.",
    url: process.env.NEXT_APP_URL,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        alt: "Notehub - A Note-Taking App",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
