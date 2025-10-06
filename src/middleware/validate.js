// Validation middleware for request bodies

export function validateRequired(fields) {
  return (req, res, next) => {
    const missing = fields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`
      });
    }
    next();
  };
}

export function validateStringLength(field, maxLength = 100) {
  return (req, res, next) => {
    const value = req.body[field];
    if (value && value.length > maxLength) {
      return res.status(400).json({
        error: `${field} must be ${maxLength} characters or less`
      });
    }
    next();
  };
}

export function validateEmail(field = 'email') {
  return (req, res, next) => {
    const email = req.body[field];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
    next();
  };
}

export function validateDate(field = 'date') {
  return (req, res, next) => {
    const date = req.body[field];
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: `${field} must be in YYYY-MM-DD format`
      });
    }
    next();
  };
}

export function validateTime(field) {
  return (req, res, next) => {
    const time = req.body[field];
    if (time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return res.status(400).json({
        error: `${field} must be in HH:MM format (24-hour)`
      });
    }
    next();
  };
}

export function validateObjectId(field) {
  return (req, res, next) => {
    const id = req.body[field] || req.params[field];
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: `Invalid ${field} format`
      });
    }
    next();
  };
}
