
// const nodemailer = require("nodemailer");

// const mailSender = async (email, title, body) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             }
//         });

//         let info = await transporter.sendMail({
//             from: 'StudyNotion || CodeHelp - by Rajan',
//             to: `${email}`,
//             subject: `${title}`,
//             html: `${body}`,
//         })
//         console.log(info);
//         return info;


//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = mailSender;


const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER, // your Gmail
        pass: process.env.MAIL_PASS, // Google App Password
      },
    });

    let info = await transporter.sendMail({
      from: `"StudyNotion || CodeHelp - by Rajan" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info.response || info);
    return info;
  } catch (error) {
    console.error("Error in mailSender:", error);
    throw error;
  }
};

module.exports = mailSender;
