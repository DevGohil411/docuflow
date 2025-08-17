const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profilePic: req.user.profilePic,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error logging out',
      });
    }
    // Clear cookie-session session and cookies
    try {
      // For cookie-session, setting session to null clears the cookie
      req.session = null;
      // Extra safety: also expire cookies explicitly with matching attributes
      const cookieOpts = {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
      };
      res.clearCookie('session', cookieOpts);
      res.clearCookie('session.sig', cookieOpts);
    } catch (e) {
      console.warn('Session clear warning:', e);
    }

    return res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });
};

module.exports = {
  getCurrentUser,
  logout,
};
