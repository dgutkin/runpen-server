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
  createdDate: String,
  journalId: String,
  uid: String
});

const goalSchema = new Schema({
  goalText: String,
  goalId: String,
  journalId: String
});

const entrySchema = new Schema({
  entryDate: String,
  entryLabel: String,
  entryEffort: String,
  entryId: String,
  journalId: String
});

const noteSchema = new Schema({
  noteTitle: String,
  noteText: String,
  noteId: String,
  entryId: String
});

const User = mongoose.model('User', userSchema);
const Journal = mongoose.model('Journal', journalSchema);
const Goal = mongoose.model('Goal', goalSchema);
const Entry = mongoose.model('Entry', entrySchema);
const Note = mongoose.model('Note', noteSchema);

export { User, Journal, Goal, Entry, Note };
