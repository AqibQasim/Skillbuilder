const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const oauthPlugin = require('fastify-oauth2')


dotenv.config();

    const googleClient = new OAuth2Client({
        clientId: '310731438548-cfvtaihk2d1pnbkhta66hffn525l96vr.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: "http://localhost:3000/auth/google/callback"
    });



module.exports = { googleClient };
