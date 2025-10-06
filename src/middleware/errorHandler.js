export function errorHandler() {
  return (err, req, res, _next) => {
    console.error('Error:', err);
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Resource already exists'
      });
    }
    
    // MongoDB validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }
    
    // Invalid ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }
    
    // Default error
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  };
}
