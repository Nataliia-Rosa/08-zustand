"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Note = {
  title: string;
  content: string;
  tag: string;
};

async function createNote(note: Note) {
  const res = await fetch("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create note");
  }

  return res.json();
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Note>({
    title: "",
    content: "",
    tag: "work",
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setForm({ title: "", content: "", tag: "work" });
      router.push("/notes");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" value={form.tag} onChange={handleChange}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>

      <button type="button" onClick={handleCancel}>
        Cancel
      </button>

      {mutation.isError && <p>Error creating note</p>}
    </form>
  );
}
