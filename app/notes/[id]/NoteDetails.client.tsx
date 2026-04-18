"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";
import NotePreview from "@/components/NotePreview/NotePreview";
import { useRouter } from "next/navigation";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <>
      <button
        className={css.backBtn}
        onClick={() => router.push("/notes/filter/all")}
      >
        Back
      </button>
      {note && <NotePreview note={note} />}
      {isError && !note && <p>Something went wrong.</p>}
      {isLoading && <p>Loading, please wait...</p>}
    </>
  );
}
