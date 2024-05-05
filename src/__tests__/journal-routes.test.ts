import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { Journal } from '../models/models';
import { getIdToken } from '../util/test-util';

const FIREBASE_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';

describe("POST /add-journal", () => {

    test("add a journal to DB", async () => {

        const token = await getIdToken();

        const journalData = {
            journalName: "Test Journal",
            createdDate: "Apr 20, 2024",
            journalId: "4AE0opqZsYfKikF63pYEd9kmPU64",
            uid: "4AE0opqZsYfKikF63pYEd9kmPU63"
        }

        const result = await request(app)
            .post('/add-journal')
            .send(journalData)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert response from server
        expect(result.text).toEqual("Journal created");

        // assert that the journal exists in the database
        const journal = await Journal.find({"journalId": "4AE0opqZsYfKikF63pYEd9kmPU64"})
        expect(journal).toBeTruthy();

    });

});

describe("GET /get-journal", () => {

    test("get a journal based on the journal id", async () => {

        const token = await getIdToken();
        const JOURNAL_ID = "4AE0opqZsYfKikF63pYEd9kmPU64";

        const result = await request(app)
            .get(`/get-journal?journalId=${JOURNAL_ID}`)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });
        
        expect(result.statusCode).toBe(200);
        expect(result.body.journalName).toBe("Test Journal");

        await Journal.deleteOne({"journalId": "4AE0opqZsYfKikF63pYEd9kmPU64"});

    });

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
