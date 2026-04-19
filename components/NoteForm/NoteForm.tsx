"use client";

import css from "./NoteForm.module.css";
import { noteTags, type NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import * as Yup from "yup";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

type NoteFormErrors = Partial<Record<keyof NoteFormValues, string>>;

const Schema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string().oneOf(noteTags).required(),
});

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useId();

  const [errors, setErrors] = useState<NoteFormErrors>({});
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleCancel = () => router.back();

  const handleSubmit = async (formData: FormData) => {
    const rawTitle = formData.get("title");
    const rawContent = formData.get("content");
    const rawTag = formData.get("tag");

    const values = {
      title: typeof rawTitle === "string" ? rawTitle.trim() : "",
      content: typeof rawContent === "string" ? rawContent.trim() : "",
      tag: typeof rawTag === "string" ? rawTag : "",
    };

    try {
      const validatedValues = await Schema.validate(values, {
        abortEarly: false,
      });

      setErrors({});

      mutate({
        title: validatedValues.title,
        content: validatedValues.content ?? "",
        tag: validatedValues.tag as NoteTag,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nextErrors: NoteFormErrors = {};

        error.inner.forEach((err) => {
          if (err.path && !nextErrors[err.path as keyof NoteFormValues]) {
            nextErrors[err.path as keyof NoteFormValues] = err.message;
          }
        });

        setErrors(nextErrors);
      }
    }
  };

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          id={`${id}-title`}
          type="text"
          name="title"
          className={css.input}
          value={draft?.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content</label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          value={draft?.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        <select
          id={`${id}-tag`}
          name="tag"
          className={css.select}
          value={draft?.tag}
          onChange={handleChange}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
          formAction={handleSubmit}
        >
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
