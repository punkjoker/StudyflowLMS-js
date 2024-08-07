const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Ensure this is correct
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up route
router.post('/signup', (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    first_name,
    last_name,
    email,
    password: hashedPassword,
    role
  };

  User.create(newUser, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the User.'
      });
    } else res.send(data);
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error retrieving user with email ' + email });
    } else if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).send({ message: 'Invalid password' });
    } else {
      const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', {
        expiresIn: 86400 // 24 hours
      });
      res.send({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        accessToken: token
      });
    }
  });
});

module.exports = router;
