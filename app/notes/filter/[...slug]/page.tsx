import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteFilter } from "@/types/note";
import { Metadata } from "next";

interface AppProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: AppProps): Promise<Metadata> => {
  const { slug } = await params;
  const actualTag = slug[0];
  return {
    title: actualTag,
    description: `Information about - ${actualTag} notes.`,
    openGraph: {
      title: actualTag,
      description: `Information about - ${actualTag} notes.`,
      url: `${process.env.NEXT_APP_URL}/notes/filter/${actualTag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: "Notehub - A Note-Taking App",
        },
      ],
    },
  };
};

export default async function App({ params }: AppProps) {
  const { slug } = await params;
  const actualTag = slug[0] as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", actualTag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag: actualTag as NoteFilter,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={actualTag as NoteFilter | "all"} />
    </HydrationBoundary>
  );
}
