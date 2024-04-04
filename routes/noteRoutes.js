import express from 'express';

const router = express.Router();

import { Note } from '../models/models.js';
import { encrypt, decrypt } from '../util/encrypt-util.js';

// route for getting all notes for a specific entry
router.get("/get-notes", async (req, res) => {

    try {

        const { entryId } = req.query;

        const notes = await Note.find({ entryId });

        const notesDecrypted = notes.map((item) => {

            if (item.noteTitleIV && item.noteTextIV) {

                const noteTitleDecrypted = decrypt(item.noteTitle, item.noteTitleIV);
                const noteTextDecrypted = decrypt(item.noteText, item.noteTextIV);

                item.noteTitle = noteTitleDecrypted;
                item.noteText = noteTextDecrypted;

            }

            return item;

        });

        return res.status(200).send(notesDecrypted);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

// route for adding a note
router.post("/add-note", async (req, res) => {

    try {

        const { noteTitle, noteText, noteId, entryId  } = req.body;

        const { cipherText: noteTitleEncrypted, initVector: noteTitleIV } = encrypt(noteTitle);
        const { cipherText: noteTextEncrypted, initVector: noteTextIV } = encrypt(noteText);

        let note = new Note({
            noteTitle: noteTitleEncrypted,
            noteTitleIV,
            noteText: noteTextEncrypted,
            noteTextIV,
            noteId,
            entryId
        });

        note.save()
            .then(() => {
                res.status(201).send("Note created");
            })

    } catch (error) {

        res.status(400).send(error.message);

    }

});

// route for deleting a note
router.delete("/delete-note", async (req, res) => {

    try {

        const { noteId } = req.query;

        await Note.findOneAndDelete({ noteId });
        
        return res.status(200).send(`Note ${noteId} deleted`);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route for updating note data
router.put("/update-note", async (req, res) => {

    try {

        const { noteTitle, noteText, noteId, entryId  } = req.body;

        const { cipherText: noteTitleEncrypted, initVector: noteTitleIV } = encrypt(noteTitle);
        const { cipherText: noteTextEncrypted, initVector: noteTextIV } = encrypt(noteText);

        await Note.updateOne(
            { noteId }, 
            { noteTitle: noteTitleEncrypted, noteTitleIV, noteText: noteTextEncrypted, noteTextIV }
        );

        return res.status(200).send(`Note ${noteId} is updated`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
