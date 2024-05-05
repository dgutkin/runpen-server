import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { Tag } from '../models/models';
import { getIdToken } from '../util/test-util';

describe("POST /add-tag", () => {

    test("add a tag to DB", async () => {

        const token = await getIdToken();

        const tagData = {
            tagText: "Test Tag",
            tagTextIV: "abc",
            tagId: "T-4AE0opqZsYfKikF63pYEd9kmPU67",
            entryId: "E-4AE0opqZsYfKikF63pYEd9kmPU66"
        }

        const result = await request(app)
            .post('/add-tag')
            .send(tagData)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert response from server
        expect(result.text).toEqual("Tag created");

        // assert that the tag exists in the database
        const entry = await Tag.find(
            {"tagId": "T-4AE0opqZsYfKikF63pYEd9kmPU67"}
        );
        expect(entry).toBeTruthy();

        await Tag.deleteOne(
            {"tagId": "T-4AE0opqZsYfKikF63pYEd9kmPU67"}
        )

    });

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
