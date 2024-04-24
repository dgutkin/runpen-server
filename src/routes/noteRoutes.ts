import { Router, Request, Response } from 'express';

const router = Router();

import { Note } from '../models/models';
import { encrypt, decrypt } from '../util/encrypt-util';

// route for getting all notes for a specific entry
router.get("/get-notes", async (req: Request, res: Response) => {

    try {

        const { entryId } = req.query;

        const notes = await Note.find({ entryId });

        const notesDecrypted = notes.map((item) => {
            console.log(item);
            if (item.noteTitle && item.noteTitleIV && item.noteText && item.noteTextIV) {
                
                const noteTitleDecrypted = decrypt(item.noteTitle, item.noteTitleIV);
                const noteTextDecrypted = decrypt(item.noteText, item.noteTextIV);

                item.noteTitle = noteTitleDecrypted;
                item.noteText = noteTextDecrypted;

            }

            return item;

        });

        return res.status(200).send(notesDecrypted);

    } catch (error) {

        return res.status(400).send(error);

    }

});

// route for adding a note
router.post("/add-note", async (req: Request, res: Response) => {

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

        res.status(400).send(error);

    }

});

// route for deleting a note
router.delete("/delete-note", async (req: Request, res: Response) => {

    try {

        const { noteId } = req.query;

        await Note.findOneAndDelete({ noteId });
        
        return res.status(200).send(`Note ${noteId} deleted`);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route for updating note data
router.put("/update-note", async (req: Request, res: Response) => {

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

        return res.status(400).send(error);

    }

});

export default router;
