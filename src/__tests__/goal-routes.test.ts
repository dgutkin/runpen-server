import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { Goal } from '../models/models';
import { getIdToken } from '../util/test-util';

describe("POST /add-goal", () => {

    test("add a goal to DB", async () => {

        const token = await getIdToken();

        const goalData = {
            goalText: "Test Goal",
            goalTextIV: "IpwfPsIBVhPhBFgz",
            goalId: "G-cff63274-cb8d-41a0-bb8a-19682abb6eb9",
            journalId: "J-4AE0opqZsYfKikF63pYEd9kmPU64"
        }

        const result = await request(app)
            .post('/add-goal')
            .send(goalData)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert response from server
        expect(result.text).toEqual(`Goal ${goalData.goalId} created`);

        // assert that the goal exists in the database
        const goal = await Goal.find(
            {"goalId": "G-cff63274-cb8d-41a0-bb8a-19682abb6eb9"}
        );
        expect(goal).toBeTruthy();

        await Goal.deleteOne(
            {"goalId": "G-cff63274-cb8d-41a0-bb8a-19682abb6eb9"}
        );

    });

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
