import NavBar from './NavBar';

export default function Sidebar() {
  return (
    <aside className="hidden h-full border-r border-neutral-200 px-6 pb-6 pt-10 dark:border-neutral-600 sm:block">
      <NavBar />
    </aside>
  );
}
