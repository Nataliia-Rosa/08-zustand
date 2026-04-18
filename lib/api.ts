import { CreateNote, Note, NoteFilter } from "@/types/note";
import axios, { type AxiosResponse } from "axios";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const apiNotes = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteFilter;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await apiNotes.get(
    "/notes",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    },
  );
  return response.data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await apiNotes.post(
    "/notes",
    payload,
    {},
  );
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await apiNotes.delete(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await apiNotes.get(`/notes/${id}`);
  return data;
};
