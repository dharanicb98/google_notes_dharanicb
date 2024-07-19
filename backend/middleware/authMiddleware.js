const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
