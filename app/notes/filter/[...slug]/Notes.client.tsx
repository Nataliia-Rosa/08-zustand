"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import NoResults from "@/components/NoResults/NoResults";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // debounce працює зі string, а не з event
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        ...(tag ? { tag } : {}),
      });

      const res = await fetch(`/api/notes?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      return res.json();
    },
  });

  return (
    <div>
      <SearchBox
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
      />

      <Link href="/notes/create">Create note</Link>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        !isLoading && <NoResults />
      )}
    </div>
  );
}
