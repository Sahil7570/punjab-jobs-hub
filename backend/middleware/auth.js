const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const resolveAdminFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    const error = new Error('Token is no longer valid.');
    error.statusCode = 401;
    throw error;
  }

  return admin;
};

const getBearerToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    req.admin = await resolveAdminFromToken(token);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    if (error.statusCode === 401) {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const optionalProtect = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return next();
    }

    req.admin = await resolveAdminFromToken(token);
    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.statusCode === 401
    ) {
      req.admin = null;
      return next();
    }

    next(error);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
  }

  next();
};

module.exports = { protect, optionalProtect, authorizeRoles };
