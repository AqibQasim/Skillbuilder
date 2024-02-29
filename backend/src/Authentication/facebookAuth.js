const fastifySecureSession = require('fastify-secure-session');
const fastifyPassport = require('fastify-passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const facebookClient = new FacebookStrategy({
    clientID: '1781633605596558',
    clientSecret: 'f99ccba457cc7448d5af76e578c7592d',
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
