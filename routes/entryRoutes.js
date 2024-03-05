import express from 'express';

const router = express.Router();

import { Entry, Note } from '../models/models.js';

// route to get all entries in a journal
router.get("/get-entries", async (req, res) => {

    try {

        const { journalId } = req.query;
        const entries = await Entry.find({ journalId });

        return res.status(200).send(entries);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route to get one entry by id
router.get("/get-entry", async (req, res) => {

    try {

        const { entryId } = req.query;
        const entry = await Entry.findOne({ entryId });
        
        return res.status(200).send(entry);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

// route to add an entry
router.post("/add-entry", async (req, res) => {

    try {

        const { entryDate, entryLabel, entryEffort, entryId, journalId } = req.body;

        let entry = new Entry({
            entryDate,
            entryLabel,
            entryEffort,
            entryId,
            journalId
        });

        entry.save()
            .then(() => {
                res.status(201).send("Entry created");
            });

    } catch(error) {

        res.status(400).send("Error creating entry");

    }

});

// route to delete an entry
router.delete("/delete-entry", async (req, res) => {

    try {

        const { entryId } = req.query;
        await Note.deleteMany({ entryId });
        await Entry.findOneAndDelete({ entryId });
        
        return res.status(204).send("Entry deleted");

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route to update an entry
router.put("/update-entry", async (req, res) => {

    try {

        const { entryLabel, entryEffort, entryId } = req.body;
        await Entry.updateOne({ entryId }, { entryLabel, entryEffort });

        return res.status(200).send(`Entry ${entryId} is updated.`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
