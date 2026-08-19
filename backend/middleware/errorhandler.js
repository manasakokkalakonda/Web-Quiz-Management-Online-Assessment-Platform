const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'A server error occurred. Please try again later.' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;