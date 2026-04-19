"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  currentTag?: string;
}

export default function NoteList({ notes, currentTag = "all" }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const detailsLink = `/notes/${note.id}`;
        return (
          <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={detailsLink} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
        );
      })}
    </ul>
  );
}
