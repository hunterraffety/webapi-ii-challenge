// dependencies
const express = require('express');

// express config.
const postsRouter = require('./data/posts-router');
const server = express();
const port = 4001;

server.get('/', (req, res) => {
  res.send(`<h1>You're looking for something at /api/posts, aren't ya?</h1>`);
});

server.use('/api/posts/', postsRouter);

server.listen(port, () => {
  console.log(`server going on ${port}`);
});
