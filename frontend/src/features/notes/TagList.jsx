import TagItem from './TagItem';
import * as propTypes from '../../utils/prop-types';
import useUpdateNote from './useUpdateNote';

export default function TagList({ note }) {
  const { updateNote } = useUpdateNote();

  if (!note?.tags) return;
  if (note?.tags.length === 0) return;

  const removeTag = e => {
    const tagToRemove = e.target.closest('button').id;

    updateNote({ note: { id: note.id, tags: note.tags.filter(tag => tag !== tagToRemove) } });
  };

  return (
    <ul className="flex flex-wrap gap-1">
      {note?.tags.map((tag, i) => (
        <TagItem tag={tag} key={i} onClick={removeTag} isRemovable={note.isTrashed} />
      ))}
    </ul>
  );
}

TagList.propTypes = {
  note: propTypes.note,
};
