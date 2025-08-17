const express = require('express');
const passport = require('passport');
const { getCurrentUser, logout } = require('../controllers/authController');
const { requireAuth, requireNoAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google', requireNoAuth, passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
}));

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/login`
  }),
  (req, res) => {
    // Successful authentication, redirect to app dashboard on frontend
    const base = process.env.CORS_ORIGIN || 'http://localhost:3000'
    res.redirect(`${base}/app/dashboard`);
  }
);

// @route   GET /auth/current_user
// @desc    Get current authenticated user
// @access  Private
router.get('/current_user', getCurrentUser);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', requireAuth, logout);

// @route   GET /auth/logout
// @desc    Logout user via browser navigation (first-party) for reliability
// @access  Public (idempotent)
router.get('/logout', (req, res) => {
  // Reuse controller to clear session/cookies, then redirect to frontend login
  logout(req, res);
});

module.exports = router;
