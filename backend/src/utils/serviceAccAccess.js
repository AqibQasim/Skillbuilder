// import { google } from "googleapis";
// import path from "path";
const { google } = require('googleapis');
const path = require("path");

async function serviceAccConfig() {
    try {
        console.log("C:/Users/WD/Skillbuilder/backend/","skill-builder-service-acc.json");
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join("C:/Users/WD/Skillbuilder/backend","skill-builder-service-acc.json"), 
            scopes: ["https://www.googleapis.com/auth/youtube.force-ssl"], 
        });

        const youtube = google.youtube({ version: "v3", auth });
        console.log("[youtube]:",youtube);
        return youtube;
    } catch (err) {
        console.log("[ERR WHILE CONFIGURING]:", err);
        return "[ERR WHILE CONFIGURING]:", err
    }
}

module.exports = {
    serviceAccConfig
}