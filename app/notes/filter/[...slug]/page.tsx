import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug && slug[0] !== "all" ? slug[0] : 'All';

  return {
    title: `Notes - ${tag} | NoteHub`,
    description: `Browse notes filtered by ${tag} in NoteHub`,
    openGraph: {
      title: `Notes - ${tag} | NoteHub`,
      description: `Browse notes filtered by ${tag} in NoteHub`,
      url: `https://example.com/notes/filter/${slug ? slug.join('/') : 'all'}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug: slugParams } = await params;
  const tag = slugParams && slugParams[0] !== "all" ? slugParams[0] : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes({ search: "", page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
