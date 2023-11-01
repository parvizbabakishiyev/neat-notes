import dotenv from 'dotenv';
import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

dotenv.config();

// env
const nameMinLen = Number(process.env.NAME_MIN_LEN);
const nameMaxLen = Number(process.env.NAME_MAX_LEN);

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minLength: nameMinLen,
      maxLength: nameMaxLen,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minLength: nameMinLen,
      maxLength: nameMaxLen,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: value => isEmail(value),
        message: 'Email is not valid',
      },
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    notes: [{ type: Schema.Types.ObjectId, ref: 'NoteModel' }],
    sharedNotes: [{ type: Schema.Types.ObjectId, ref: 'NoteModel' }],
    passwordResetToken: { type: String, trim: true },
    passwordResetTokenExpiry: Number,
    createdAt: { type: Number, default: null, trim: true },
    updatedAt: { type: Number, default: null, trim: true },
  },
  { timestamps: { currentTime: () => Math.floor(Date.now()) } }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    // replace _id with id
    ret.id = ret._id;
    delete ret._id;
    // remove __v
    delete ret.__v;
    // remove password data
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetTokenExpiry;
  },
});

const UserModel = model('UserModel', userSchema, 'users');

export default UserModel;
