import express, { Request, Response, Router } from 'express';

const router = Router();

import { Goal } from '../models/models';
import { encrypt, decrypt } from '../util/encrypt-util';

// route to get all goals in a journal
router.get("/get-goals", async (req: Request, res: Response) => {

    try {

        const { journalId } = req.query;

        const goals = await Goal.find({ journalId });

        const goalsDecrypted = goals.map((item) => {
            
            if (item.goalTextIV && item.goalText) {

                const goalTextDecrypted = decrypt(
                    item.goalText,
                    item.goalTextIV
                );
                
                item.goalText = goalTextDecrypted;

            }
            
            return item;

        });

        return res.status(200).send(goalsDecrypted);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route to add a goal
router.post("/add-goal", async (req: Request, res: Response) => {

    try {

        const { goalText, goalId, journalId } = req.body;

        const { cipherText, initVector } = encrypt(goalText);

        let goal = new Goal({
            goalText: cipherText,
            goalTextIV: initVector,
            goalId,
            journalId
        });

        goal.save()
            .then(() => {
                res.status(201).send(`Goal ${goalId} created`);
            });

    } catch(error) {

        res.status(400).send(error);

    }

});

// route to delete a goal
router.delete("/delete-goal", async (req: Request, res: Response) => {

    try {

        const { goalId } = req.query;

        await Goal.findOneAndDelete({ goalId });
        
        return res.status(204).send(`Goal ${goalId} deleted`);

    } catch(error) {

        return res.status(400).send(error);

    }

});

// route to update a goal
router.put("/update-goal", async (req: Request, res: Response) => {

    try {

        const { goalText, goalId } = req.body;

        const { cipherText, initVector } = encrypt(goalText);

        await Goal.updateOne(
            { goalId }, 
            { goalText: cipherText, goalTextIV: initVector }
        );

        return res.status(200).send(`Goal ${goalId} is updated.`);

    } catch (error) {

        return res.status(400).send(error);

    }

});

export default router;
