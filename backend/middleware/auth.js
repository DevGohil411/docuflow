const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please log in to access this resource.',
    });
  }
  next();
};

const requireNoAuth = (req, res, next) => {
  // Allow explicit re-auth when requested via query flag
  const reauth = req.query?.reauth
  if (req.user && !(reauth === '1' || reauth === 'true')) {
    return res.status(400).json({
      success: false,
      message: 'You are already logged in.',
    });
  }
  next();
};

module.exports = {
  requireAuth,
  requireNoAuth,
};
