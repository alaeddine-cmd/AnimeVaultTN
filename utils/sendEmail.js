const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: "mootezjaballah00@gmail.com",
        pass: "prmiyztygeaoabiq",
      },
    });

    await transporter.sendMail({
      from: "mootezjaballah00@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
