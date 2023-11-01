import { Schema, model } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const noteTitleMaxLen = Number(process.env.NOTE_TITLE_MAX_LEN);
const noteContentMaxLen = Number(process.env.NOTE_CONTENT_MAX_LEN);
const tagNameMaxLen = Number(process.env.TAG_NAME_MAX_LEN);

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxLength: noteTitleMaxLen,
    },
    textContent: {
      type: String,
      required: true,
      trim: true,
      maxLength: noteContentMaxLen,
    },
    colorHex: {
      type: String,
      trim: true,
      default: '#ffffff',
      validate: {
        validator: value => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
        message: 'Invalid color hex format',
      },
    },
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    sharedUsers: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }],
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    isArchived: { type: Boolean, default: false, trim: true },
    archivedAt: { type: Number, default: null, trim: true },
    isTrashed: { type: Boolean, default: false, trim: true },
    trashedAt: { type: Number, default: null, trim: true },
    tags: [{ type: String, required: true, trim: true, maxLength: tagNameMaxLen }],
    createdAt: { type: Number, default: null, trim: true },
    updatedAt: { type: Number, default: null, trim: true },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now()) },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // replace _id with id
        ret.id = ret._id;
        delete ret._id;
        // delete __v
        delete ret.__v;
      },
    },
  }
);

const NoteModel = model('NoteModel', noteSchema, 'notes');

export default NoteModel;
