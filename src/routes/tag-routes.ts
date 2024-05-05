import { Router, Request, Response } from 'express';

const router = Router();

import { Tag, Entry } from '../models/models';
import { encrypt, decrypt } from '../util/encrypt-util';

// route for getting all tags for a specific entry
router.get("/get-tags", async (req: Request, res: Response) => {

    try {

        const { id, allJournal } = req.query;
        
        let tags;

        if (allJournal === 'true') {
            const entries = await Entry.find({ journalId: id });
            tags = await Tag.find(
                { entryId: 
                    {"$in": entries.map((item) => item.entryId)} 
                }
            );
        } else {
            tags = await Tag.find({ entryId: id });
        }

        const tagsDecrypted = tags.map((item) => {

            if (item.tagText && item.tagTextIV) {

                const tagTextDecrypted = decrypt(item.tagText, item.tagTextIV);

                item.tagText = tagTextDecrypted;

            }

            return item;

        });

        return res.status(200).send(tagsDecrypted);

    } catch (error) {

        return res.status(400).send(error);

    }

});

// route for adding a tag
router.post("/add-tag", async (req: Request, res: Response) => {

    try {

        const { tagText, tagId, entryId  } = req.body;

        const { cipherText: tagTextEncrypted, initVector: tagTextIV } = encrypt(tagText);

        let tag = new Tag({
            tagText: tagTextEncrypted,
            tagTextIV,
            tagId,
            entryId
        });

        tag.save()
            .then(() => {
                res.status(201).send("Tag created");
            })

    } catch (error) {

        res.status(400).send(error);

    }

});

// route for deleting a tag
router.delete("/delete-tag", async (req: Request, res: Response) => {

    try {

        const { tagId } = req.query;

        await Tag.findOneAndDelete({ tagId });
        
        return res.status(200).send(`Tag ${tagId} deleted`);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route for updating tag data
router.put("/update-tag", async (req: Request, res: Response) => {

    try {

        const { tagText, tagId, entryId  } = req.body;

        const { cipherText: tagTextEncrypted, initVector: tagTextIV } = encrypt(tagText);

        await Tag.updateOne(
            { tagId }, 
            { tagText: tagTextEncrypted, tagTextIV }
        );

        return res.status(200).send(`Tag ${tagId} is updated`);

    } catch (error) {

        return res.status(400).send(error);

    }

});

export default router;
