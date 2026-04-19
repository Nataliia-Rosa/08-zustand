"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../../lib/api";
import { useRouter } from "next/navigation";
import Loader from "../../../../components/Loader/Loader";
import Modal from "../../../../components/Modal/Modal";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  
  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <button onClick={handleClose}>
        Close
      </button>

      {isLoading && <Loader />}
      {error && <p>Failed to load note details.</p>}
      
      {note && (
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <hr />
          <p>Tag: {note.tag}</p>
          <p>Created at: {new Date(note.createdAt).toLocaleString()}</p>
        </div>
      )}
    </Modal>
  );
}
