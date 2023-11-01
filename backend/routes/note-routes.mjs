import { Router } from 'express';
import * as authControllers from '../controllers/auth-controllers.mjs';
import * as noteControllers from '../controllers/note-controllers.mjs';
import * as authValidations from '../validations/auth-validations.mjs';
import * as noteValidations from '../validations/note-validations.mjs';

const router = Router();

router
  .get(
    '/',
    authValidations.authenticateUser,
    noteValidations.getNotes,
    authControllers.authenticateUser,
    noteControllers.getOwnNotes
  )
  .get(
    '/all',
    authValidations.authenticateUser,
    noteValidations.getNotes,
    authControllers.authenticateUser,
    noteControllers.getAllNotes
  )
  .get(
    '/shared',
    authValidations.authenticateUser,
    noteValidations.getNotes,
    authControllers.authenticateUser,
    noteControllers.getSharedNotes
  )
  .get(
    '/archived',
    authValidations.authenticateUser,
    noteValidations.getNotes,
    authControllers.authenticateUser,
    noteControllers.getArchivedNotes
  )
  .get(
    '/trashed',
    authValidations.authenticateUser,
    noteValidations.getNotes,
    authControllers.authenticateUser,
    noteControllers.getTrashedNotes
  )
  .get('/count', authValidations.authenticateUser, authControllers.authenticateUser, noteControllers.countNotes)
  .get(
    '/:noteId',
    authValidations.authenticateUser,
    noteValidations.getNote,
    authControllers.authenticateUser,
    noteControllers.getNote
  )
  .post(
    '/',
    authValidations.authenticateUser,
    noteValidations.createNote,
    authControllers.authenticateUser,
    noteControllers.createNote
  )
  .patch(
    '/:noteId/archive',
    authValidations.authenticateUser,
    noteValidations.noteId,
    authControllers.authenticateUser,
    noteControllers.archiveNote
  )
  .patch(
    '/:noteId/unarchive',
    authValidations.authenticateUser,
    noteValidations.noteId,
    authControllers.authenticateUser,
    noteControllers.unarchiveNote
  )
  .patch(
    '/:noteId/share',
    authValidations.authenticateUser,
    noteValidations.noteIdAndEmail,
    authControllers.authenticateUser,
    noteControllers.shareNote
  )
  .patch(
    '/:noteId/unshare',
    authValidations.authenticateUser,
    noteValidations.noteIdAndEmail,
    authControllers.authenticateUser,
    noteControllers.unshareNote
  )
  .patch(
    '/:noteId/restore',
    authValidations.authenticateUser,
    noteValidations.noteId,
    authControllers.authenticateUser,
    noteControllers.restoreNote
  )
  .patch(
    '/:noteId',
    authValidations.authenticateUser,
    noteValidations.updateNote,
    authControllers.authenticateUser,
    noteControllers.updateNote
  )
  .delete('/trash', authValidations.authenticateUser, authControllers.authenticateUser, noteControllers.emptyTrash)
  .delete(
    '/:noteId/trash',
    authValidations.authenticateUser,
    noteValidations.noteId,
    authControllers.authenticateUser,
    noteControllers.trashNote
  )
  .delete(
    '/:noteId',
    authValidations.authenticateUser,
    noteValidations.noteId,
    authControllers.authenticateUser,
    noteControllers.deleteNote
  );

export default router;
