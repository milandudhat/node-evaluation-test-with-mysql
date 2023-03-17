const express = require("express");
const validateUser = require("../../middlewares/validate");
const postController = require("../../controllers/posts/postController.js");
const router = express.Router();

// get all posts
router.get("/getPosts", validateUser, postController.getPosts);

// create a post
router.post("/createPost", validateUser, postController.createPost);

// delete a post
router.delete("/deletePost", validateUser, postController.deletePost);

// update a post
router.put("/updatePost", validateUser, postController.updatepost);

module.exports = router;
