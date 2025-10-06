const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token;

  // Authorization header check: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  } 

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user me id set kar do
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
