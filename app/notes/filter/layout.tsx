import css from "./layout.module.css";

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div className={css.filterLayout}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <main className={css.content}>
        {children}
      </main>
    </div>
  );
}
