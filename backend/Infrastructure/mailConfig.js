
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();

//console.log(process.env.GMAIL_REFRESH_TOKEN)

const oauth2Client= new OAuth2Client({
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
})

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const accessToken= oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  //port: 587,
  auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      // pass: process.env.GMAIL_PASS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken
  }
});

module.exports= transporter;