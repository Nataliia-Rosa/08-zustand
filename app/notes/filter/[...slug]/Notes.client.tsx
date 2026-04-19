"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import { getNotes } from "@/api/notes";
import { SearchBox } from "@/components/SearchBox";
import { NoteList } from "@/components/NoteList";
import { Pagination } from "@/components/Pagination";
import { NoResults } from "@/components/NoResults";

type Props = {
  initialPage?: number;
  initialSearch?: string;
  initialTag?: string;
};

export default function NotesClient({
  initialPage = 1,
  initialSearch = "",
  initialTag = "",
}: Props) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(e.target.value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      getNotes({
        page,
        search,
        tag,
      }),
    keepPreviousData: true,
  });

  const notes = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isError) {
    return <div>Помилка завантаження нотаток</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SearchBox onChange={handleSearchChange} />
        <Link
          href="/notes/create"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Створити нотатку
        </Link>
      </div>

      {isLoading ? (
        <div>Завантаження...</div>
      ) : notes.length === 0 ? (
        <NoResults />
      ) : (
        <NoteList notes={notes} />
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onNext={() => setPage((p) => p + 1)}
          onPrev={() => setPage((p) => p - 1)}
        />
      )}
    </div>
  );
}
