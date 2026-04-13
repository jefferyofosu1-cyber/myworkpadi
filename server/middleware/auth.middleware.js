import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('[CRITICAL] JWT_SECRET is not defined in environment variables.');
  process.exit(1); 
}

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains userId, role, adminRole, etc.
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrative privileges required' });
  }
  next();
};

export const authorizeTasker = (req, res, next) => {
  if (req.user?.role !== 'tasker' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Tasker privileges required' });
  }
  next();
};
