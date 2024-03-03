const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv=require('dotenv')
dotenv.config();

const facebookClient = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email'] // Specify the profile fields you want to retrieve
  },
  function(accessToken, refreshToken, profile, done) {
    // Your logic to handle user authentication and profile data
    // For example, you can find or create a user based on the profile data
    // Then call done with the user object
    return done(null, profile);
  }
);

module.exports = { facebookClient };
