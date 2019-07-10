// dependencies
const express = require('express');

// data
const Posts = require('./db');

// express config
const router = express.Router();

// router config
router.use(express.json());

// endpoints~

// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find(req.query);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    });
  }
});

// get a specific post
router.get('/:id', async (req, res) => {
  console.log(`/:id with ${req.params.id}`);
  try {
    const post = await Posts.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'The post with the specified ID does not exist.'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'The post information could not be retrieved.'
    });
  }
});

// add a post
router.post('/', async (req, res) => {
  try {
    const postItem = await Posts.insert(req.body);
    res.status(201).json(postItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'There was an error while saving the post to the database'
    });
  }
});

function isValidContent(content) {
  const { title, contents } = message;
  return title && contents;
}

// export
module.exports = router;
