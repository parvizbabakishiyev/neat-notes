import mongoose from 'mongoose';
import UserModel from '../models/user-model.mjs';
import NoteModel from '../models/note-model.mjs';
import redisClient from '../redis.mjs';
import { httpError } from '../utils.mjs';

const { ObjectId } = mongoose.Types;

export async function getOwnUser(req, res, next) {
  try {
    const { userId } = req.user;

    // get user info from db
    const user = await UserModel.findById(new ObjectId(userId));

    // check user existence
    if (!user) return next(httpError(422, 'user_not_found', 'User does not exists'));

    // send a response
    res.json({
      user: user.toJSON(),
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function updateOwnUser(req, res, next) {
  try {
    const { userId } = req.user;
    const { firstname, lastname, email } = req.body;

    // get user info from db
    const user = await UserModel.findById(new ObjectId(userId));

    // check if user found
    if (!user) return next(httpError(422, 'user_not_found', 'User does not exist'));

    // check if the new email is not already exists, first check if the email is different from the existing one
    if (email !== user.email && email.length > 0) {
      const userByEmail = await UserModel.findOne({ email });
      // if there is already a user with the updated email then return
      const err = httpError(422, 'user_exists', 'A user is already exists with this email');
      // add details to identify the request field with an error
      err.errors = [
        {
          field: 'email',
          message: 'A user is already exists with this email',
          input: email,
          inputLocation: 'body',
        },
      ];

      if (userByEmail) return next(err);
    }

    // update the user
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    await user.save();

    // send a response
    res.json({ user });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}

export async function deleteOwnUser(req, res, next) {
  try {
    await mongoose.connection.transaction(async session => {
      const { userId } = req.user;

      // find the user in db
      const user = await UserModel.findById(new ObjectId(userId)).session(session);

      // check if user found to delete
      if (!user) return next(httpError(422, 'user_not_found', 'User does not exist'));

      // delete user from shared notes
      const { sharedNotes } = await UserModel.findById(new ObjectId(userId))
        .populate({
          path: 'sharedNotes',
        })
        .select('sharedNotes')
        .session(session);

      sharedNotes.forEach(async note => {
        await NoteModel.findByIdAndUpdate(new ObjectId(note.id), {
          $pull: { sharedUsers: new ObjectId(userId) },
        }).session(session);
      });

      // delete user's note(s)
      await NoteModel.deleteMany({ user: new ObjectId(userId) }).session(session);

      // delete user from db
      await UserModel.deleteOne({ _id: new ObjectId(userId) }).session(session);

      // revoke refresh token
      await redisClient.del(userId);

      // send a response
      res.status(204).send();
    });
  } catch (err) {
    return next(httpError(500, 'internal_error', '', err));
  }
}
