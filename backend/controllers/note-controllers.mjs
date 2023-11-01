import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import NoteModel from '../models/note-model.mjs';
import { httpError } from '../utils.mjs';
import UserModel from '../models/user-model.mjs';

dotenv.config();
const { ObjectId } = mongoose.Types;

// env
const trashExpiry = Number(process.env.KEEP_IN_TRASH_SECONDS) * 1000;

const notePopulation = {
  path: 'user sharedUsers lastEditedBy',
  select: 'firstname lastname email',
};

async function cleanupNote(userId, noteId, session) {
  // find user
  const user = await UserModel.findById(userId).session(session);
  const note = await NoteModel.findById(new ObjectId(noteId)).session(session);

  // check if there is  a user
  if (!user) throw httpError(422, 'user_not_found', 'User does not exist');

  // check if the note is found
  if (!note) throw httpError(422, 'note_not_found', 'Note does not exist');

  // check if the user is owner of the note
  if (note.user.toString() !== userId) throw httpError(401, 'unauthorized', 'Unauthorized');

  // check if the note is trashed, otherwise do not allow to delete it
  if (!note.isTrashed)
    throw httpError(422, 'cannot_delete_untrashed_note', 'A note cannot be deleted without trashing it first');

  // pull the note from refs
  user.notes.pull(note._id);
  await user.save({ session });

  // remove note ID from the shared users' sharedNotes
  for (const sharedUserId of note.sharedUsers) {
    await UserModel.findByIdAndUpdate(new ObjectId(sharedUserId), {
      $pull: { sharedNotes: new ObjectId(noteId) },
    }).session(session);
  }

  // remove sharedUsers from the note
  note.sharedUsers = [];
  await note.save({ session });

  // delete the note from db
  await NoteModel.findByIdAndDelete(new ObjectId(noteId)).session(session);
}

export async function getNote(req, res, next) {
  try {
    const { noteId } = req.params;
    const { userId } = req.user;

    // get the note from db
    const note = await NoteModel.findById({
      _id: new ObjectId(noteId),
      user: new ObjectId(userId),
    }).populate(notePopulation);

    // check if the note exists
    if (!note) {
      return next(httpError(422, 'note_not_found', 'Note does not exist'));
    }

    // send a response
    res.json({ note });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function getOwnNotes(req, res, next) {
  try {
    const { userId } = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const skip = limit * (page - 1);

    const query = {
      user: new ObjectId(userId),
      isArchived: false,
      isTrashed: false,
    };

    // get all user notes from db
    const notes = await NoteModel.find(query).populate(notePopulation).sort('-createdAt').skip(skip).limit(limit);
    const totalNotes = await NoteModel.countDocuments(query);

    // respond with notes
    res.json({ totalNotes, notes });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function getAllNotes(req, res, next) {
  try {
    const { userId } = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const start = limit * (page - 1);
    const end = limit * page;

    // find user in db
    const user = await UserModel.findById({ _id: new ObjectId(userId) }).select('notes sharedNotes');

    // populate note info
    const { notes: ownNotes, sharedNotes } = await user.populate({
      path: 'notes sharedNotes',
      populate: notePopulation,
      match: { $and: [{ isArchived: false }, { isTrashed: false }] },
    });

    // process db data
    let notes = ownNotes.concat(sharedNotes).sort((a, b) => b.createdAt - a.createdAt);
    const totalNotes = notes.length;
    if (limit && page) notes = notes.slice(start, end);

    // respond with notes
    res.json({ totalNotes, notes });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function getSharedNotes(req, res, next) {
  try {
    const { userId } = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const skip = limit * (page - 1);

    // find user in db and populate
    const user = await UserModel.findById({ _id: new ObjectId(userId) }).select('sharedNotes');
    const totalNotes = user.sharedNotes.length;

    const { sharedNotes } = await user.populate({
      path: 'sharedNotes',
      options: { sort: { updatedAt: 'desc' }, skip, limit },
      populate: notePopulation,
    });

    // respond with notes
    res.json({ totalNotes, notes: sharedNotes });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function getArchivedNotes(req, res, next) {
  try {
    const { userId } = req.user;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const skip = limit * (page - 1);

    const query = {
      user: new ObjectId(userId),
      isArchived: true,
      isTrashed: false,
    };

    // get all archived user notes from db
    const notes = await NoteModel.find(query).populate(notePopulation).sort('-archivedAt').skip(skip).limit(limit);
    const totalNotes = await NoteModel.countDocuments(query);

    // respond with notes
    res.json({ totalNotes, notes });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function getTrashedNotes(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { userId } = req.user;
      const limit = Number(req.query.limit);
      const page = Number(req.query.page);
      const skip = limit * (page - 1);

      const query = {
        user: new ObjectId(userId),
        isTrashed: true,
      };

      const queryToDelete = {
        user: new ObjectId(userId),
        isTrashed: true,
        trashedAt: { $lt: Date.now() - trashExpiry },
      };

      // cleanup expired trashed notes
      const notesToCleanUp = await NoteModel.find(queryToDelete).session(session);
      notesToCleanUp.forEach(async ({ id: noteId }) => await cleanupNote(userId, noteId, session));

      // get all trashed user notes from db
      const notes = await NoteModel.find(query)
        .populate(notePopulation)
        .sort('-trashedAt')
        .skip(skip)
        .limit(limit)
        .session(session);
      const totalNotes = await NoteModel.countDocuments(query).session(session);

      // send a response
      res.json({ totalNotes, notes });
    });
  } catch (err) {
    // check if custom errors was thrown in try block, pass it to Express error handler
    if (err.statusCode && err.statusCode !== 500) return next(err);
    // otherwise return internal_error, it's not an expected error
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function countNotes(req, res, next) {
  try {
    const { userId } = req.user;

    const queryArchived = {
      user: new ObjectId(userId),
      isArchived: true,
      isTrashed: false,
    };

    const queryTrashed = {
      user: new ObjectId(userId),
      isTrashed: true,
    };

    // find the used in db
    const user = await UserModel.findById({ _id: new ObjectId(userId) });
    // get all own notes count, including archived and trashed notes
    const countOwn = user.notes.length;
    // get shared notes count
    const countShared = user.sharedNotes.length;

    const countArchived = await NoteModel.countDocuments(queryArchived);
    const countTrashed = await NoteModel.countDocuments(queryTrashed);
    // count all notes which aren't archived or trashed, include shared notes
    const countAll = countOwn - (countArchived + countTrashed) + countShared;

    // send response
    res.json({
      count: {
        all: countAll,
        own: countOwn - (countArchived + countArchived),
        shared: countShared,
        archived: countArchived,
        trashed: countTrashed,
      },
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function createNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { title, textContent, colorHex, tags } = req.body;
      const { userId } = req.user;

      // find user in db
      const user = await UserModel.findById(new ObjectId(userId)).session(session);
      if (!user) {
        return next(httpError(422, 'user_not_found', 'User does not exists'));
      }

      // create document in db
      const note = new NoteModel({
        title,
        textContent,
        colorHex,
        user: userId,
        tags,
        lastEditedBy: new ObjectId(userId),
      });
      await note.save({ session });

      // add the note to user's notes
      user.notes.push(note._id);
      await user.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({
        note,
      });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function updateNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { title, textContent, colorHex, tags } = req.body;
      const { noteId } = req.params;
      const { userId } = req.user;
      // find and update the note in db
      const note = await NoteModel.findById(new ObjectId(noteId)).session(session);

      // check if there was a note to update
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // check if the user is authorized, owns note or it is shared with the user
      if (note.user.toString() !== userId && !note.sharedUsers.includes(userId))
        return next(httpError(401, 'unauthorized', 'Unauthorized'));

      // update the note
      if (title || title === '') note.title = title;
      if (textContent) note.textContent = textContent;
      if (colorHex) note.colorHex = colorHex;
      if (tags) note.tags = Array.from(new Set(tags));
      note.lastEditedBy = new ObjectId(userId);
      await note.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });
      // send a response
      res.json(note);
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function archiveNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { userId } = req.user;

      // try to update the note in db
      const note = await NoteModel.findOne({
        _id: new ObjectId(noteId),
        user: new ObjectId(userId),
      }).session(session);

      // check if there was a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // update the note
      note.isArchived = true;
      note.archivedAt = Date.now();

      // remove note ID from the shared users' sharedNotes
      note.sharedUsers.forEach(async sharedUserID => {
        await UserModel.findByIdAndUpdate(new ObjectId(sharedUserID), {
          $pull: { sharedNotes: new ObjectId(noteId) },
        }).session(session);
      });

      // remove sharedUsers from the note
      note.sharedUsers = [];
      await note.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function unarchiveNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { userId } = req.user;

      // try to update the note in db
      const note = await NoteModel.findOne({
        _id: new ObjectId(noteId),
        user: new ObjectId(userId),
      }).session(session);

      // check if there was a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // update the note
      note.isArchived = false;
      note.archivedAt = null;
      await note.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });

      await session.commitTransaction();
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function trashNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { userId } = req.user;

      // try to update the note in db
      const note = await NoteModel.findOne({
        _id: new ObjectId(noteId),
        user: new ObjectId(userId),
      }).session(session);

      // check if there was a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // update the note, this includes unsharing
      note.isTrashed = true;
      note.trashedAt = Date.now();

      // remove note ID from the shared users' sharedNotes
      note.sharedUsers.forEach(async sharedUserID => {
        await UserModel.findByIdAndUpdate(new ObjectId(sharedUserID), {
          $pull: { sharedNotes: new ObjectId(noteId) },
        }).session(session);
      });

      // remove sharedUsers from the note
      note.sharedUsers = [];
      await note.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function restoreNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { userId } = req.user;

      // try to update the note in db
      const note = await NoteModel.findOne({
        _id: new ObjectId(noteId),
        user: new ObjectId(userId),
      }).session(session);

      // check if there was a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // update the note
      note.isTrashed = false;
      note.trashedAt = null;
      await note.save({ session });

      // populate user info for the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function deleteNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { userId } = req.user;

      // delete the note
      await cleanupNote(userId, noteId, session);

      // send a response
      res.status(204).send();
    });
  } catch (err) {
    // check if custom errors was thrown in try block, pass it to Express error handler
    if (err.statusCode && err.statusCode !== 500) return next(err);
    // otherwise return internal_error, it's not an expected error
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function emptyTrash(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { userId } = req.user;

      // query for trashed notes
      const queryTrashed = {
        user: new ObjectId(userId),
        isTrashed: true,
      };

      // cleanup
      const notesToCleanUp = await NoteModel.find(queryTrashed).session(session);
      for (const { id: noteId } of notesToCleanUp) await cleanupNote(userId, noteId, session);

      // send a response
      res.status(204).send();
    });
  } catch (err) {
    // check if custom errors was thrown in try block, pass it to Express error handler
    if (err.statusCode && err.statusCode !== 500) return next(err);
    // otherwise return internal_error, it's not an expected error
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function shareNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { email } = req.body;
      const { userId } = req.user;

      // get the note from db
      const note = await NoteModel.findById(new ObjectId(noteId)).session(session);

      // check if there is a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // get the user based on email from db
      const user = await UserModel.findOne({ email }).session(session);

      // check if there is  a user
      if (!user) {
        return next(httpError(422, 'user_not_found', 'A user does not exists with this email'));
      }

      // check if it's a self-sharing
      if (user._id.toString() === userId)
        return next(httpError(422, 'self_share_not_allowed', 'The user is the owner of the note'));

      // check if the notes is already shared with the user
      if (note.sharedUsers.includes(new ObjectId(user.id)))
        return next(httpError(422, 'already_shared', 'The note is already shared with this email'));

      // update in db
      note.sharedUsers.push(user._id);
      user.sharedNotes.push(note._id);
      await note.save({ session });
      await user.save({ session });

      // populate the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function unshareNote(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { noteId } = req.params;
      const { email } = req.body;
      const { userId } = req.user;

      // get the note from db
      const note = await NoteModel.findById(new ObjectId(noteId)).session(session);

      // check if there is a note
      if (!note) {
        return next(httpError(422, 'note_not_found', 'Note does not exist'));
      }

      // get the user based on email from db
      const user = await UserModel.findOne({ email }).session(session);

      // check if there is  a user
      if (!user) {
        return next(httpError(422, 'user_not_found', 'User does not exist'));
      }

      // update user's shared notes
      user.sharedNotes.pull(note._id);
      await user.save({ session });

      // check if it's a self-sharing
      if (user._id.toString() === userId)
        return next(httpError(422, 'self_share_not_allowed', 'User is the owner of the note'));

      // update notes
      note.sharedUsers.pull(user._id);
      await note.save({ session });

      // populate the note
      await note.populate({ ...notePopulation, session });

      // send a response
      res.json({ note });
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}
