const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const oauthPlugin = require('fastify-oauth2');
const { config } = require('bluebird');


dotenv.config();

    const googleClient = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: "http://localhost:3000/auth/google/callback"
    });



module.exports = { googleClient };
