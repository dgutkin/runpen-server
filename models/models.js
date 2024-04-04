import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  uid: String
});

const journalSchema = new Schema({
  journalName: String,
  journalNameIV: String,
  createdDate: String,
  journalId: String,
  uid: String
});

const goalSchema = new Schema({
  goalText: String,
  goalTextIV: String,
  goalId: String,
  journalId: String
});

const entrySchema = new Schema({
  entryDate: String,
  entryLabel: String,
  entryLabelIV: String,
  entryEffort: String,
  entryEffortIV: String,
  entryId: String,
  journalId: String
});

const noteSchema = new Schema({
  noteTitle: String,
  noteTitleIV: String,
  noteText: String,
  noteTextIV: String,
  noteId: String,
  entryId: String
});

const User = mongoose.model('User', userSchema);
const Journal = mongoose.model('Journal', journalSchema);
const Goal = mongoose.model('Goal', goalSchema);
const Entry = mongoose.model('Entry', entrySchema);
const Note = mongoose.model('Note', noteSchema);

export { User, Journal, Goal, Entry, Note };
