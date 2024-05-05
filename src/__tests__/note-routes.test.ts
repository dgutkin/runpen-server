import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { Note } from '../models/models';
import { getIdToken } from '../util/test-util';

describe("POST /add-note", () => {

    test("add a note to DB", async () => {

        const token = await getIdToken();

        const noteData = {
            noteTitle: "Test Note Title",
            noteTitleIV: "abc",
            noteText: "Test Note Message",
            noteTextIV: "def",
            noteId: "N-4AE0opqZsYfKikF63pYEd9kmPU99",
            entryId: "E-4AE0opqZsYfKikF63pYEd9kmPU66"
        }

        const result = await request(app)
            .post('/add-note')
            .send(noteData)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert response from server
        expect(result.text).toEqual("Note created");

        // assert that the note exists in the database
        const entry = await Note.find(
            {"noteId": "N-4AE0opqZsYfKikF63pYEd9kmPU99"}
        );
        expect(entry).toBeTruthy();

        await Note.deleteOne(
            {"noteId": "N-4AE0opqZsYfKikF63pYEd9kmPU99"}
        );

    });

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
