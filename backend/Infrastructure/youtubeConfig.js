const fastify = require('fastify')({ logger: true });
const { google } = require('googleapis');
// const multer = require('fastify-multer');
const fs = require('fs');

const credentials = require('../client-secret.json');

// async function configureGoogleClient(){
const oauth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
);

const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
];

// const redirectUri = 'http://localhost:4000/oauth2callback';
// oauth2Client.setRedirectUri(redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

console.log('Authorize this app by visiting this url:', authUrl);
// }

module.exports = {
    oauth2Client,
    scopes,
    authUrl
}
