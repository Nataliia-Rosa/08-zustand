"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Loader from "@/components/Loader/Loader";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import css from "./page.module.css";

const PER_PAGE = 12;

interface NotesProps {
  tag: string;
}

export default function Notes({ tag }: NotesProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const notesQueryKey = useMemo(
    () => ["notes", page, search, tag],
    [page, search, tag]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: notesQueryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag: tag && tag !== "all" ? (tag as NoteTag) : undefined,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link
          href="/notes/action/create"
          className={css.button}
        >
          New Note
        </Link>
      </header>

      {isLoading && <Loader />}

      {isError && (
        <p className={css.error}>
          Failed to load notes. Please try again later.
        </p>
      )}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} currentTag={tag} />
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.empty}>No notes found.</p>
      )}
    </main>
  );
}
