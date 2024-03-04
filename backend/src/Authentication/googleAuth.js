const { OAuth2Client } = require('google-auth-library');


    const GoogleClient = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/auth/google/callback`
    });



module.exports = { GoogleClient };
