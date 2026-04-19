"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { NoteTag } from "@/types/note";
import css from "./SidebarNotes.module.css";

const tags: (NoteTag | "all")[] = ["all", "Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  const params = useParams<{ slug?: string[] }>();
  const currentTag = params.slug?.[0] || "all";

  return (
    <aside className={css.sidebar}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={`/notes/filter/${tag}`}
              className={`${css.menuLink} ${currentTag === tag ? css.active : ""}`}
            >
              {tag === "all" ? "All notes" : tag}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
