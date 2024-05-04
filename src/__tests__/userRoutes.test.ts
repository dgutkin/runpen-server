
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { User } from '../models/models';

describe("POST /add-user", () => {

    const FIREBASE_API = 'https://identitytoolkit.googleapis.com/v1/accounts:';

    beforeEach(async () => {

        await User.deleteMany();

    });

    test("add a user to the DB and return a 201", async () => {

        const data = {
            email: "jest@mail.com",
            password: "password",
            returnSecureToken: true
        };

        // get the user token
        const tokenResponse = await fetch(
            FIREBASE_API + 'signUp?key=' + process.env.FIREBASE_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        const token = await tokenResponse.json();

        // hit API with user sign up
        const result = await request(app)
            .post("/add-user")
            .send({
                name: "Test Jest",
                email: "jest@mail.com",
                password: "password",
                uid: "5rINhTXG7IRBlD3OjUd9drPbvei2"
            })
            .set({
                'Accept': 'application/json', 
                'Authorization': `Bearer ${token.idToken}`
            });
        
        // assert a 201
        expect(result.statusCode).toEqual(201);
        expect(result.text).toEqual("User created.");
        
        // delete account on Firebase
        await fetch(
            FIREBASE_API + 'delete?key=' + process.env.FIREBASE_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({'idToken': token.idToken})
            }
        )

        const user = await User.find({"name": "Test Jest"})
        expect(user).toBeDefined();

    });

    afterAll((done) => {
        mongoose.connection.close();
        done();
    });

});
