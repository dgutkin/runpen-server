import { Router, Request, Response } from 'express';

const router = Router();

import { Entry, Note } from '../models/models';
import { encrypt, decrypt } from '../util/encrypt-util';

// route to get all entries in a journal
router.get("/get-entries", async (req: Request, res: Response) => {

    try {

        const { journalId } = req.query;

        const entries = await Entry.find({ journalId });

        const entriesDecrypted = entries.map((item) => {

            if (item.entryLabel && item.entryLabelIV) {

                const entryLabelDecrypted = decrypt(item.entryLabel, item.entryLabelIV);

                item.entryLabel = entryLabelDecrypted;

            }
            
            return item;

        });

        return res.status(200).send(entriesDecrypted);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route to get one entry by id
router.get("/get-entry", async (req: Request, res: Response) => {

    try {

        const { entryId } = req.query;

        const entry = await Entry.findOne({ entryId });

        if (entry?.entryLabel && entry?.entryLabelIV) {

            const entryLabelDecrypted = decrypt(entry.entryLabel, entry.entryLabelIV);

            entry.entryLabel = entryLabelDecrypted;

        }
        
        return res.status(200).send(entry);

    } catch (error) {

        return res.status(400).send(error);

    }

});

// route to add an entry
router.post("/add-entry", async (req: Request, res: Response) => {

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
router.delete("/delete-entry", async (req: Request, res: Response) => {

    try {

        const { entryId } = req.query;
        
        await Note.deleteMany({ entryId });
        await Entry.findOneAndDelete({ entryId });
        
        return res.status(204).send("Entry deleted");

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route to update an entry
router.put("/update-entry", async (req: Request, res: Response) => {

    try {

        const { entryLabel, entryId } = req.body;

        const { cipherText: entryLabelEncrypted, initVector: entryLabelIV } = encrypt(entryLabel);

        await Entry.updateOne(
            { entryId }, 
            { entryLabel: entryLabelEncrypted, entryLabelIV, }
        );

        return res.status(200).send(`Entry ${entryId} is updated.`);

    } catch (error) {

        return res.status(400).send(error);

    }

});

export default router;
