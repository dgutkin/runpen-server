import { Router, Request, Response } from 'express';

const router = Router();

import { Journal, Goal, Entry, Tag, Note } from '../models/models';
import { encrypt, decrypt } from '../util/encrypt-util';

// route for adding a new journal
router.post("/add-journal", async (req: Request, res: Response) => {

    try {

        const { journalName, createdDate, journalId, uid } = req.body;
        
        const { cipherText, initVector } = encrypt(journalName);
        
        let journal = new Journal({
            journalName: cipherText,
            journalNameIV: initVector,
            createdDate,
            journalId,
            uid
        });

        journal.save()
            .then(() => {
                res.status(201).send("Journal created");
            });

    } catch(error) {

        res.status(400).send(error);

    }

});

// route for getting the list of journals
router.get("/get-journals", async (req: Request, res: Response) => {

    try {

        const { uid } = req.query;
        const journals = await Journal.find({ uid });
        
        const journalsDecrypted = journals.map((item) => {

            if (item.journalNameIV && item.journalName) {

                const journalNameDecrypted = decrypt(
                    item.journalName,
                    item.journalNameIV
                );
                
                item.journalName = journalNameDecrypted;

            }
            
            return item;

        });
        
        return res.status(200).send(journalsDecrypted);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route for getting the journal name
router.get("/get-journal", async (req: Request, res: Response) => {

    try {

        const { journalId } = req.query;

        const journal = await Journal.findOne({ journalId });

        if (journal?.journalNameIV && journal?.journalName) {

            const journalNameDecrypted = decrypt(
                journal.journalName, 
                journal.journalNameIV
            );
            
            journal.journalName = journalNameDecrypted;

        }
        
        return res.status(200).send(journal);

    } catch(error) {

        return res.status(400).send(error);

    }
    
});

// route for deleting a journal
router.delete("/delete-journal", async (req: Request, res: Response) => {
    
    try {

        const { journalId } = req.query;

        const entries = await Entry.find({ journalId }, { entryId:1 });
        const entryArr = entries.map((item) => {
            return item.entryId;
        });
        const entryFilter = {"$in" : entryArr}
        
        await Note.deleteMany({ entryId: entryFilter });
        await Tag.deleteMany({entryId: entryFilter});
        await Entry.deleteMany({ entryId: entryFilter });
        await Goal.deleteMany({ journalId: journalId });
        await Journal.findOneAndDelete({ journalId });
        
        return res.status(204).send("Journal deleted");

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route for updating a journal
router.put("/update-journal", async (req: Request, res: Response) => {

    try {

        const { journalName, createdDate, journalId, uid } = req.body;

        const { cipherText, initVector } = encrypt(journalName);

        await Journal.updateOne(
            { journalId }, 
            { journalName: cipherText, journalNameIV: initVector }
        );

        return res.status(200).send(`Journal ${journalId} is updated`);

    } catch (error) {

        res.status(400).send(error);
        
    }

});

export default router;
