"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Note = {
  title: string;
  content: string;
  tag: string;
};

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [note, setNote] = useState<Note>({
    title: "",
    content: "",
    tag: "work",
  });

  const mutation = useMutation({
    mutationFn: async (newNote: Note) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(newNote),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNote({ title: "", content: "", tag: "work" });
      router.push("/notes");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(note);
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          name="title"
          value={note.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Content</label>
        <textarea
          name="content"
          value={note.content}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Tag</label>
        <select name="tag" value={note.tag} onChange={handleChange}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="study">Study</option>
        </select>
      </div>

      <button type="submit" disabled={mutation.isPending}>
        Create
      </button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}
