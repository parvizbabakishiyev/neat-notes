import { TbNotes, TbArchive, TbTrash } from 'react-icons/tb';
import PropTypes from 'prop-types';
import NavItem from '../ui/NavItem';
import NavProfile from '../ui/NavProfile';
import useGetAllNotes from '../features/notes/useGetAllNotes';
import useGetArchivedNotes from '../features/notes/useGetArchivedNotes';
import useGetTrashedNotes from '../features/notes/useGetTrashedNotes';

export default function NavBar({ onClose }) {
  const { notes: notesAll } = useGetAllNotes();
  const { notes: notesArchived } = useGetArchivedNotes();
  const { notes: notesTrashed } = useGetTrashedNotes();

  const countAll = notesAll?.length || 0;
  const countArchived = notesArchived?.length || 0;
  const countTrashed = notesTrashed?.length || 0;

  return (
    <nav className="h-full">
      <ul className="flex h-full flex-col gap-2" onClick={e => e.target.closest('li') && onClose && onClose()}>
        <NavItem to="/notes" icon={<TbNotes />} desc="My notes" count={countAll} />
        <NavItem to="/notes/archived" icon={<TbArchive />} desc="Archived" count={countArchived} />
        <NavItem to="/notes/trashed" icon={<TbTrash />} desc="Trashed" count={countTrashed} />
        <div className="mt-auto">
          <NavProfile to="/profile" />
        </div>
      </ul>
    </nav>
  );
}

NavBar.propTypes = {
  onClose: PropTypes.func,
};
