const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const Delivery = require('../models/Delivery');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided. Access denied.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded Token:', decoded);

    // Find user in the correct collection based on role in token
    let Model;
    switch (decoded.role) {
      case 'admin': Model = Admin; break;
      case 'seller': Model = Seller; break;
      case 'delivery': Model = Delivery; break;
      default: Model = User;
    }

    req.user = await Model.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ success: false, error: `Account with role ${decoded.role} not found.` });
    }

    // Safety: ensure role is available for authorize middleware
    if (!req.user.role) {
      req.user.role = decoded.role;
    }

    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token. Authorization failed.' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const normalizedRoles = roles.map(r => r.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      console.log(`[AUTH DEBUG] 403 Forbidden: User Role "${userRole}" not in Allowed Roles [${normalizedRoles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        error: `User role ${userRole} is not authorized to access this route`
      });
    }
    next();
  };
};
// Optional protect: tries to find user but proceeds if not found
exports.tryProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let Model;
    switch (decoded.role) {
      case 'admin': Model = Admin; break;
      case 'seller': Model = Seller; break;
      case 'delivery': Model = Delivery; break;
      default: Model = User;
    }
    req.user = await Model.findById(decoded.id);
    
    // Safety: ensure role is available
    if (req.user && !req.user.role) {
      req.user.role = decoded.role;
    }
    
    next();
  } catch (err) {
    next(); // Just proceed without user
  }
};
