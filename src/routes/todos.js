const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(todos);
});

router.post('/', async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = await Todo.create({ userId: req.user.id, title: title.trim() });
  return res.status(201).json(todo);
});

router.patch('/:id', async (req, res) => {
  const { completed, title } = req.body;
  const update = {};

  if (typeof completed === 'boolean') {
    update.completed = completed;
  }

  if (typeof title === 'string' && title.trim()) {
    update.title = title.trim();
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true }
  );

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  return res.json(todo);
});

router.delete('/:id', async (req, res) => {
  const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!result) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  return res.status(204).send();
});

module.exports = router;
