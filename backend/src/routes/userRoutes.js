const { postUser, FindAllUsers, Login, GoogleLogin, GoggleLoginCallBAck, EmailVarify } = require("../controllers/userController");
const fastifySecureSession = require('fastify-secure-session');
const dotenv = require('dotenv');
const fastifyPassport = require('fastify-passport');
const { OAuth2Client } = require('google-auth-library');
const FacebookStrategy = require('passport-facebook').Strategy;
const oauthPlugin = require('fastify-oauth2')
const axios = require('axios');


dotenv.config();

const userRoutes = async (fastify, options) => {
    // Define routes
    fastify.post('/create-user', postUser);
    fastify.get('/users', FindAllUsers);
    fastify.post('/login', Login);

    fastify.get('/auth/google', GoogleLogin);
    fastify.get('/auth/google/callback', GoggleLoginCallBAck);

    fastify.get('/verify-email', EmailVarify);

    

};

module.exports = userRoutes
