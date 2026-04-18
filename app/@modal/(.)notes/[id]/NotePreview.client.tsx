"use client";

import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NotePreviewClient() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        Close
      </button>
      {note && <NotePreview note={note} />}
      {isError && !note && <p>Something went wrong.</p>}
      {isLoading && <p>Loading, please wait...</p>}
    </Modal>
  );
}
