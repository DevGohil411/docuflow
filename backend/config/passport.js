const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userService = require('../services/userService');

// Build an absolute callback URL to avoid redirect_uri mismatch
const BASE_URL = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
const EFFECTIVE_GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK_URL || `${BASE_URL}/auth/google/callback`;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: EFFECTIVE_GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const displayName = profile && profile.displayName ? profile.displayName : '';
        const email = Array.isArray(profile.emails) && profile.emails[0] ? profile.emails[0].value : '';
        const photo = Array.isArray(profile.photos) && profile.photos[0] ? profile.photos[0].value : '';
        const googleId = profile && profile.id ? profile.id : undefined;

        if (!googleId) {
          return done(new Error('Google profile missing id'), null);
        }
        // Check if user already exists
        let existingUser = await userService.findUserByGoogleId(googleId);

        if (existingUser) {
          // Update user info in case it changed
          const updatedUser = await userService.updateUser(existingUser.id, {
            name: displayName,
            email: email,
            profilePic: photo,
            avatar: photo,
          });
          return done(null, updatedUser);
        }

        // Create new user
        const newUser = await userService.createUser({
          googleId: googleId,
          name: displayName,
          email: email,
          profilePic: photo,
          avatar: photo,
        });

        done(null, newUser);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        done(error, null);
      }
    }
  )
);

// Helpful log at startup (appears once) to verify callback URL
if (process.env.NODE_ENV !== 'test') {
  console.log('[Auth] Google OAuth callback URL:', EFFECTIVE_GOOGLE_CALLBACK);
}

module.exports = passport;
