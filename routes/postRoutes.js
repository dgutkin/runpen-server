import express from 'express';

const router = express.Router();

import { Post } from '../models/models.js';

// route for getting all posts for a specific entry
router.get("/get-posts", async (req, res) => {

    try {

        const { entryId } = req.query;
        const posts = await Post.find({ entryId });

        return res.status(200).send(posts);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

// route for adding a post
router.post("/add-post", async (req, res) => {

    try {

        const { postTitle, postText, postId, entryId  } = req.body;
        let post = new Post({
            postTitle,
            postText,
            postId,
            entryId
        });
        post.save()
            .then(() => {
                res.status(201).send("Post created");
            })

    } catch (error) {

        res.status(400).send("Error creating post");

    }

});

// route for deleting a post
router.delete("/delete-post", async (req, res) => {

    try {

        const { postId } = req.query;
        const response = await Post.findOneAndDelete({ postId });
        
        return res.status(200).send(`Post ${postId} deleted`);

    } catch(error) {

        return res.status(400).send(error.message);

    }

});

// route for updating post data
router.put("/update-post", async (req, res) => {

    try {

        const { postTitle, postText, postId, entryId  } = req.body;
        await Post.updateOne({ postId }, { postTitle, postText });

        return res.status(200).send(`Post ${postId} is updated`);

    } catch (error) {

        return res.status(400).send(error.message);

    }

});

export default router;
