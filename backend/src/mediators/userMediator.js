const nodemailer = require("nodemailer");
const { logger } = require("../../logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: "fa21bscs0017@maju.edu.pk",
            to: email,
            subject: "Email Verification",
            html: ` <a href="http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/verify-email?email=${encodeURIComponent(email)}&verificationToken=${verificationToken}">Verify your email</a>`,
        };

        await transporter.sendMail(mailOptions);

        logger.info("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

const verifyPassword = async (password, existingUser) => {
    const passwordMatch = await bcrypt.compare(password, existingUser?.password);
    logger.info(["password matching", passwordMatch]);
    if (!passwordMatch) {
        throw Error("Sorry! your password is incorrect!")
    }
    const tokenPayload = {
        id: existingUser?.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        profession: existingUser.profession
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const option = {
        headers: {
            "Set-Cookie": cookie.serialize("token", token, {
                // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }),
        },
    };

    return { token, option };
}


module.exports = { sendVerificationEmail, verifyPassword }