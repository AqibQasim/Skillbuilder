
const fastify = require('fastify')({ logger: true });
const { google } = require('googleapis');
// const multer = require('fastify-multer');
const fs = require('fs');
const { oauth2Client } = require('../../Infrastructure/youtubeConfig');
// const upload = multer({ dest: 'uploads/' });
const path = require('path');
const { before } = require('lodash');
// const { resolveClientEndpointParameters } = require('@aws-sdk/client-s3/dist-types/endpoint/EndpointParameters');

async function googleAPICallBack(request, reply) {
    const { code } = request.query;
    console.log('the code is:', code);
    console.log("executing this callback");
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        reply.send('Authentication successful! You can now upload videos.');
    } catch (error) {
        fastify.log.error('Error retrieving access token', error);
        console.error('Error retrieving access token:', error.response.data || error.message || error);
        reply.status(500).send('Authentication failed');
    }
}



async function fetchVideos(request, reply) {
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });

    try {
        const response = await youtube.videos.list({
            part: 'snippet,contentDetails,statistics',
            mine: true
        });

        reply.send(response.data);
    } catch (error) {
        fastify.log.error('Error fetching videos', error);
        reply.status(500).send('Error fetching videos');
    }
}



module.exports = {
    googleAPICallBack,
    fetchVideos
}