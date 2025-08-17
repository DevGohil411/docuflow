// Custom error classes for better error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class FirebaseError extends AppError {
  constructor(message, originalError) {
    super(message, 500);
    this.originalError = originalError;
  }
}

// Global error handler middleware
const globalErrorHandler = (error, req, res, next) => {
  let { statusCode = 500, message } = error;

  // Handle Firebase errors
  if (error.code && error.code.startsWith('firebase')) {
    statusCode = 500;
    message = 'Firebase operation failed';
  }

  // Handle Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 10MB.';
  }

  if (error.message && error.message.includes('Invalid file type')) {
    statusCode = 400;
    message = error.message;
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error.message 
    }),
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  FirebaseError,
  globalErrorHandler,
};
