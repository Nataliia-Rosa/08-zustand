import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";

export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note",
  openGraph: {
    title: "Create Note",
    description: "Create a new note",
    url: "https://example.com/notes/action/create",
    images: [
      {
        url: "https://example.com/og-image.jpg",
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main>
      <h1>Create Note</h1>
      <NoteForm />
    </main>
  );
}
