const {createUser,findUser,LoginUser,LogWithGoogle,AfterGoogleLoginRedirect,UserContact,} = require("../repositories/userRepository");
const nodemailer = require("nodemailer");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

const FindUser = async () => {
  return await findUser();
};
const UserLogin = async (LoginData) => {
  return await LoginUser(LoginData);
};

const googleLogin = async () => {
  return LogWithGoogle();
};
const googleClient = async (code) => {
  return await AfterGoogleLoginRedirect(code);
};

const ContactUser = async (userInfo) => {
  try {
    const ContactUs = await UserContact(userInfo);
    console.log("Contact Us in Service ", ContactUs);
    if (ContactUs) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "fa21bscs0017@maju.edu.pk",
          pass: "ncld ucwk kfac hzvh",
        },
      });

      const UsermailOptions = {
        from: "fa21bscs0017@maju.edu.pk",
        to: `${userInfo.email} }  `,
        subject: `Message From SkillBuilder`,
        html: `<p>Hello ${userInfo.FirstName} ${userInfo.LastName},</p>
                 <p>Thank you for contacting us. We have received your email. Our team will review it shortly and contact you as soon as possible.</p>`,
      };
      const AdminmailOptions = {
        from: `${userInfo.email}`,
        to: `${"rajaasgharali009@gmail.com"} }  `,
        subject: `${userInfo.Subject}`,
        html: `<p>New Message From${userInfo.FirstName} ${userInfo.LastName},</p>
               <p>${userInfo.Text}</p>`,
      };
      console.log("AdminMail", AdminmailOptions);

      await transporter.sendMail(UsermailOptions);
      await transporter.sendMail(AdminmailOptions);
      console.log(
        `Email Successfully Send t0 ${
          userInfo.email
        } ${"rajaasgharali009@gmail.com"}`
      );
      return ContactUs;
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

module.exports = {
  registerUser,
  FindUser,
  UserLogin,
  googleLogin,
  googleClient,
  ContactUser,
};
