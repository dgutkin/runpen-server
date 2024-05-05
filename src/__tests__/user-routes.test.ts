
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server';
import { User } from '../models/models';
import { getIdToken } from '../util/test-util';

describe("POST /add-user", () => {

    test("add a user to the DB and return a 201", async () => {

        const FIREBASE_API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';

        const data = {
            email: "jest_signup@mail.com",
            password: "password",
            returnSecureToken: true
        };

        // get the user token
        const tokenResponse = await fetch(
            FIREBASE_API_URL + 'signUp?key=' + process.env.FIREBASE_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );
        const token = await tokenResponse.json();

        // hit runPen API with user sign up
        const result = await request(app)
            .post("/add-user")
            .send({
                name: "Jest SignUp",
                email: "jest_signup@mail.com",
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
            FIREBASE_API_URL + 'delete?key=' + process.env.FIREBASE_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({'idToken': token.idToken})
            }
        )

        const user = await User.find({"name": "Jest SignUp"})
        expect(user).toBeDefined();

        // delete from DB
        await User.deleteOne({"name": "Jest SignUp"});

    });

});

describe("GET /get-user-name", () => {

    test("get a user's user name from the DB", async () => {

        const UID = "4AE0opqZsYfKikF63pYEd9kmPU63";

        const token = await getIdToken();
        
        // hit runPen API with get user name
        const result = await request(app)
            .get(`/get-user-name?uid=${UID}`)
            .set({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.idToken}`
            });

        // assert correct user name
        expect(result.text).toEqual("Test Dev");

    });  

});

afterAll((done) => {
    mongoose.connection.close();
    done();
});
