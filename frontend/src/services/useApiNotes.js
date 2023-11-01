import useFetch from '../hooks/useFetch';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function useApiNotes() {
  const { fetchInterceptor } = useFetch();

  const getNote = async noteId => await fetchInterceptor(`${baseUrl}/notes/${noteId}`);

  const getOwnNotes = async () => await fetchInterceptor(`${baseUrl}/notes`);

  const getSharedNotes = async () => await fetchInterceptor(`${baseUrl}/notes/shared`);

  const getAllNotes = async () => await fetchInterceptor(`${baseUrl}/notes/all`);

  const getArchivedNotes = async () => await fetchInterceptor(`${baseUrl}/notes/archived`);

  const getTrashedNotes = async () => await fetchInterceptor(`${baseUrl}/notes/trashed`);

  const countNotes = async () => await fetchInterceptor(`${baseUrl}/notes/count`);

  const createNote = async (title, textContent, colorHex, tags) => {
    const body = JSON.stringify({ title, textContent, colorHex, tags });
    const data = await fetchInterceptor(`${baseUrl}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    return data;
  };

  const updateNote = async (noteId, title, textContent, tags, colorHex) => {
    const body = JSON.stringify({
      title,
      textContent,
      tags,
      colorHex,
    });

    const data = await fetchInterceptor(`${baseUrl}/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    return data;
  };

  const shareNote = async (noteId, email) => {
    const body = JSON.stringify({ email });
    await fetchInterceptor(`${baseUrl}/notes/${noteId}/share`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  };

  const unshareNote = async (noteId, email) => {
    const body = JSON.stringify({ email });

    await fetchInterceptor(`${baseUrl}/notes/${noteId}/unshare`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  };

  const deleteNote = async noteId =>
    await fetchInterceptor(`${baseUrl}/notes/${noteId}`, {
      method: 'DELETE',
    });

  const emptyTrash = async () =>
    await fetchInterceptor(`${baseUrl}/notes/trash`, {
      method: 'DELETE',
    });

  const archiveNote = async noteId =>
    await fetchInterceptor(`${baseUrl}/notes/${noteId}/archive`, {
      method: 'PATCH',
    });

  const unarchiveNote = async noteId =>
    await fetchInterceptor(`${baseUrl}/notes/${noteId}/unarchive`, {
      method: 'PATCH',
    });

  const trashNote = async noteId =>
    await fetchInterceptor(`${baseUrl}/notes/${noteId}/trash`, {
      method: 'DELETE',
    });

  const restoreNote = async noteId =>
    await fetchInterceptor(`${baseUrl}/notes/${noteId}/restore`, {
      method: 'PATCH',
    });

  return {
    getNote,
    getOwnNotes,
    getSharedNotes,
    getAllNotes,
    getArchivedNotes,
    getTrashedNotes,
    countNotes,
    createNote,
    updateNote,
    shareNote,
    unshareNote,
    deleteNote,
    emptyTrash,
    archiveNote,
    unarchiveNote,
    trashNote,
    restoreNote,
  };
}
