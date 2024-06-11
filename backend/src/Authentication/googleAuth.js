const GoogleStrategy = require("passport-google-oauth2").Strategy;
const fastifyPassport = require('@fastify/passport');
const { logger } = require("../../logger");
const { createGoogleUser } = require("../services/userService");

fastifyPassport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
}, async function (accessToken, refreshToken, profile, cb) {
    cb(undefined, profile)
    const fullName = profile.displayName;
    const [first_name, ...last_name_arr] = fullName.split(' ');
    const last_name = last_name_arr.join(' ');

    const userData = {
        first_name : first_name,
        last_name : last_name,
        email: profile.emails[0].value,
        source: profile.provider
    }

    await createGoogleUser(userData);
}
))

fastifyPassport.default.registerUserSerializer(async (user, req) => {
    logger.info([ "user in serializer: ", user ])
    return user;
})

fastifyPassport.default.registerUserDeserializer(async (user, req) => {
    logger.info(["user in deserializer: ", user])
    return user;
})

 