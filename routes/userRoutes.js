import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

import { User } from '../models/models.js';

// create user route
router.post("/add-user", async (req, res) => {

    try {
  
        const { name, email, password, uid } = req.body;

        // Simple validation, check if both email and password are provided
        if (!name || !email || !password) {
          return res.status(400).json({ error: 'Name, email and password are required.' });
        }
  
        // check if the user is already in use with mongoose
        let userExists = await User.findOne({ email });

        if (userExists) {
          res.status(401).send("Email is already in use");
          return;
        }

        // Define salt rounds
        const saltRounds = 10;
        
        // Hash password
        bcrypt.hash(password, saltRounds, (err, hash) => {

          if (err) throw new Error("Internal Server Error");

          // Create a new user
          let user = new User({
            name,
            email,
            password: hash,
            uid
          });

          // Save user to database
          user.save()
            .then(() => {
              res.status(201).send("User created.");
            });
        
        });
  
    } catch(error) {

      return res.status(401).send(error.message);
      
    }
    
});

// get user name route
router.get("/get-user-name", async (req, res) => {

  try {

    const { uid } = req.query;
    const user = await User.findOne({ uid });
    const userName = user.name;

    return res.status(200).send(userName);

  } catch(error) {

    return res.status(400).send(error.message);

  }

});

// get user background image
router.get("/get-background-image", async (req, res) => {

  try {

    const { uid } = req.query;
    const user = await User.findOne({ uid });
    const bgImage = user.bgImage

    return res.status(200).send(bgImage);

  } catch(error) {

    return res.status(400).send(error.message);

  }

});

// update user background image
router.put("/update-background-image", async (req, res) => {

  try {

    const { uid, bgImage } = req.body;
    await User.updateOne({ uid }, { bgImage });
    
    return res.status(200).send("User background image is updated.");

  } catch(error) {

    return res.status(400).send(error.message);

  }

});
  
export default router;
