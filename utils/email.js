const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Housing agency <temiloluwaogunti8@gmail.com>`; //use env variable
  }

  newTransport() {
    return nodemailer.createTransport({
      // host: process.env.EMAIL_SERVER_HOST,
      host: "in-v3.mailjet.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.PASS,
      },
    });

  }

  async send(title, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: title,
      html,
      // text
    };

    await this.newTransport().sendMail(mailOptions);
  }

  //   start defining all types of send emails
  async sendWelcome() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Housing Project!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

  <table style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
    <tr>
      <td style="text-align: center;">
        <img src="https://yourhousingproject.com/logo.png" alt="Housing Project Logo" style="max-width: 150px;">
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h1 style="color: #333; margin-top: 0;">Welcome to Our Housing Project!</h1>
        <p style="color: #666;">Dear ${this.name},</p>
        <p style="color: #666;">Thank you for signing up for our housing project! We're thrilled to have you on board.</p>
        <p style="color: #666;">Our project aims to provide you with the best housing solutions that fit your needs. Whether you're looking to buy, rent, or invest, we've got you covered.</p>
        <p style="color: #666;">Feel free to explore our website and check out the available listings. If you have any questions, don't hesitate to reach out to us.</p>
        <p style="color: #666;">Welcome aboard!</p>
        <p style="color: #666;">Best regards,<br>Your Housing Project Team</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #333; padding: 10px; text-align: center; border-radius: 5px;">
        <a href="${this.url}" style="text-decoration: none; color: #fff;">Visit Our Website</a>
      </td>
    </tr>
  </table>

</body>
</html>
`;
    await this.send("Welcome to our housing project", html);
  }
}

module.exports = Email;


// host - in-v3.mailjet.com
// 4553407cb2d3945109fdae159e6d5a68 api key
// f5b2feec48f635d6712db809d2a35a85 secret key
