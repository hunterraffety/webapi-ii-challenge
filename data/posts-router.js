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

// get comments for a post
router.get('/:id/comments', (req, res) => {
  console.log(`hit ${req.params.id}/comments`);
  const { id } = req.params;
  Posts.findPostComments(id)
    .then(comments => {
      if (comments && comments.length) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

// add a post
router.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post' });
  } else {
    try {
      const postItem = await Posts.insert(req.body);
      res.status(201).json(postItem);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    }
  }
});

// update a post

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'Deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// add a comment to a post
router.post('/:id/comments', (req, res) => {
  if (!isValidComment(req.body)) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    Posts.insertComment(req.body)
      .then(comment => {
        res.status(201).json(comment);
      })
      .catch(() => {
        res.status(500).json({
          error: 'There was an error while saving the comment to the database.'
        });
      });
  }
});

function isValidComment(comment) {
  const { text, post_id } = comment;
  return text && post_id;
}

// export
module.exports = router;
