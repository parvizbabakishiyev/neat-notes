import * as validation from './validation.mjs';

export const getNote = validation.validate(['params'], {
  noteId: validation.objectId, // params
});

export const getNotes = validation.validate(['query'], {
  limit: validation.pagination, // query
  page: validation.pagination, // query
});

export const createNote = validation.validate(['body'], {
  title: validation.noteTitle, // body
  textContent: validation.noteContent, // body
  colorHex: validation.colorHex, // body
  tags: validation.tagsArray, // body
  'tags.*': validation.tagName, // body
});

export const updateNote = validation.validate(['params', 'body'], {
  title: { ...validation.noteTitle, optional: true }, // body
  textContent: validation.noteContent, // body
  colorHex: validation.colorHex, // body
  tags: validation.tagsArray, // body
  'tags.*': validation.tagName, // body
  noteId: validation.objectId, // params
});

export const noteId = validation.validate(['params'], {
  noteId: validation.objectId, // params
});

export const noteIdAndEmail = validation.validate(['params', 'body'], {
  noteId: validation.objectId, // params
  email: validation.email, // body
});
