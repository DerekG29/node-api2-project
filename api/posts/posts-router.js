// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: "The posts information could not be retrieved" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else {
      res.status(200).json(post)
    }
  } catch {
    res.status(500).json({ message: "The post information could not be retrieved" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
      const { id } = await Posts.insert({ title, contents });
      const post = await Posts.findById(id);
      res.status(201).json(post);
    }
  } catch {
    res.status(500)
      .json({ message: "There was an error while saving the post to the database" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, contents } = req.body;
    const id = req.params.id;
    if (!title || !contents) {
      res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
      const post = await Posts.findById(id);
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        await Posts.update(id, { title, contents });
        const updatedPost = await Posts.findById(id);
        res.status(200).json(updatedPost);
      }
    }
  } catch {
    res.status(500).json({ message: "The post information could not be modified" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    } else {
      await Posts.remove(id);
      res.status(200).json(post);
    }
  } catch {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

module.exports = router;