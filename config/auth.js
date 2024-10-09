const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = await User.findById(decoded._id);
    next();
  } catch (ex) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Access denied. You do not have permission.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };