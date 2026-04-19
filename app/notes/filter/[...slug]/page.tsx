import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import Notes from "./Notes.client";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || "all";
  const tagName = tag === "all" ? "All Notes" : tag;

  return {
    title: `NoteHub - ${tagName}`,
    description: `Browse all notes with tag: ${tagName}`,
    openGraph: {
      title: `NoteHub - ${tagName}`,
      description: `Browse all notes with tag: ${tagName}`,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tagName}`,
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] || "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: "",
        tag: tag && tag !== "all" ? (tag as NoteTag) : undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
