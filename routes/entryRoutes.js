import express from 'express';

const router = express.Router();

import { Entry, Note } from '../models/models.js';
import { encrypt, decrypt } from '../util/encrypt-util.js';

// route to get all entries in a journal
router.get("/get-entries", async (req, res) => {

    try {

        const { journalId } = req.query;

        const entries = await Entry.find({ journalId });

        const entriesDecrypted = entries.map((item) => {

            if (item.entryLabelIV) {

                const entryLabelDecrypted = decrypt(item.entryLabel, item.entryLabelIV);

                item.entryLabel = entryLabelDecrypted;

            }
            
            return item;

        });

        return res.status(200).send(entriesDecrypted);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route to get one entry by id
router.get("/get-entry", async (req, res) => {

    try {

        const { entryId } = req.query;

        const entry = await Entry.findOne({ entryId });

        if (entry.entryLabelIV) {

            const entryLabelDecrypted = decrypt(entry.entryLabel, entry.entryLabelIV);

            entry.entryLabel = entryLabelDecrypted;

        }
        
        return res.status(200).send(entry);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

// route to add an entry
router.post("/add-entry", async (req, res) => {

    try {

        const { entryDate, entryLabel, entryId, journalId } = req.body;

        const { cipherText: entryLabelEncrypted, initVector: entryLabelIV } = encrypt(entryLabel);

        let entry = new Entry({
            entryDate,
            entryLabel: entryLabelEncrypted,
            entryLabelIV,
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

        const { entryLabel, entryId } = req.body;

        const { cipherText: entryLabelEncrypted, initVector: entryLabelIV } = encrypt(entryLabel);

        await Entry.updateOne(
            { entryId }, 
            { entryLabel: entryLabelEncrypted, entryLabelIV, }
        );

        return res.status(200).send(`Entry ${entryId} is updated.`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
