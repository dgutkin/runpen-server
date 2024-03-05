import express from 'express';

const router = express.Router();

import { Note } from '../models/models.js';

// route for getting all notes for a specific entry
router.get("/get-notes", async (req, res) => {

    try {

        const { entryId } = req.query;
        const notes = await Note.find({ entryId });

        return res.status(200).send(notes);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

// route for adding a note
router.post("/add-note", async (req, res) => {

    try {

        const { noteTitle, noteText, noteId, entryId  } = req.body;
        let note = new Note({
            noteTitle,
            noteText,
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
        const response = await Note.findOneAndDelete({ noteId });
        
        return res.status(200).send(`Note ${noteId} deleted`);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route for updating note data
router.put("/update-note", async (req, res) => {

    try {

        const { noteTitle, noteText, noteId, entryId  } = req.body;
        await Note.updateOne({ noteId }, { noteTitle, noteText });

        return res.status(200).send(`Note ${noteId} is updated`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
