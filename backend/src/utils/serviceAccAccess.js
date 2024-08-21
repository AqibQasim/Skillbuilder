// import { google } from "googleapis";
// import path from "path";
const { google } = require('googleapis');

// Initialize the YouTube API client using the service account
async function serviceAccConfig() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, "path/to/your-service-account-key.json"), // Use the path to your downloaded key file
            scopes: ["https://www.googleapis.com/auth/youtube.force-ssl"], // This scope gives access to manage YouTube videos
        });

        const youtube = google.youtube({ version: "v3", auth });
        return youtube;
    } catch (err) {
        console.log("[ERR WHILE CONFIGURING]:", err);
        return "[ERR WHILE CONFIGURING]:", err
    }
}

module.exports = {
    serviceAccConfig
}
// Now you can use the `youtube` object to interact with YouTube Data API
