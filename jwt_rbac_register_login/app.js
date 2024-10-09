const express = require('express');
const app = express();
const mongoose = require('./config/database');
const { authenticate, authorize } = require('./config/auth');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(express.json());

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ message: 'User created successfully' });
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(401).send({ error: 'Invalid password' });
  }

  const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '1h' });
  res.send({ token });
});

app.get('/protected', authenticate, authorize(['admin', 'moderator']), (req, res) => {
  res.send({ message: 'Hello, ' + req.user.name });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});