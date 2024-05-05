import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { Entry } from '../models/models';
import { getIdToken } from '../util/test-util';

describe("POST /add-entry", () => {

    test("add an entry to DB", async () => {

        const token = await getIdToken();

        const entryData = {
            entryDate: "Apr 20, 2024",
            entryLabel: "Test Entry Label",
            entryLabelIV: "IpwfPsIBVhPhBFgz",
            entryId: "E-4AE0opqZsYfKikF63pYEd9kmPU66",
            journalId: "J-4AE0opqZsYfKikF63pYEd9kmPU65"
        }

        const result = await request(app)
            .post('/add-entry')
            .send(entryData)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert response from server
        expect(result.text).toEqual("Entry created");

        // assert that the entry exists in the database
        const entry = await Entry.find({"entryId": "E-4AE0opqZsYfKikF63pYEd9kmPU66"})
        expect(entry).toBeTruthy();

    });

});

describe("GET /get-entry", () => {

    test("get a entry based on the entry id", async () => {

        const token = await getIdToken();
        const ENTRY_ID = "E-4AE0opqZsYfKikF63pYEd9kmPU66";

        const result = await request(app)
            .get(`/get-entry?entryId=${ENTRY_ID}`)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });
        
        expect(result.statusCode).toBe(200);
        expect(result.body.entryLabel).toBe("Test Entry Label");

        await Entry.deleteOne(
            {"entryId": "E-4AE0opqZsYfKikF63pYEd9kmPU66"}
        );

    });

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
