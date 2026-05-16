const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'testuser',
      pass: process.env.SMTP_PASSWORD || 'testpass',
    },
  });

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || 'Riddha Mart'} <${process.env.FROM_EMAIL || 'noreply@riddhamart.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
