import express from 'express';

const router = express.Router();

import { Goal } from '../models/models.js';

// route to get all goals in a journal
router.get("/get-goals", async (req, res) => {

    try {

        const { journalId } = req.query;
        const goals = await Goal.find({ journalId });

        return res.status(200).send(goals);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route to add a goal
router.post("/add-goal", async (req, res) => {

    try {

        const { goalText, goalId, journalId } = req.body;

        let goal = new Goal({
            goalText,
            goalId,
            journalId
        });

        goal.save()
            .then(() => {
                res.status(201).send(`Goal ${goalId} created`);
            });

    } catch(error) {

        res.status(400).send(error.message);

    }

});

// route to delete a goal
router.delete("/delete-goal", async (req, res) => {

    try {

        const { goalId } = req.query;
        await Goal.findOneAndDelete({ goalId });
        
        return res.status(204).send(`Goal ${goalId} deleted`);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route to update a goal
router.put("/update-goal", async (req, res) => {

    try {

        const { goalText, goalId } = req.body;
        await Goal.updateOne({ goalId }, { goalText });

        return res.status(200).send(`Goal ${goalId} is updated.`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
