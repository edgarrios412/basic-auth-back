const nodemailer = require('nodemailer');// eslint-disable-line
const jwt = require('jsonwebtoken');

const pass = "dahriyrlifdgqwip";
const email = "edgarrios412@gmail.com";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass,
  },
});

const sendVerificationEmail = (token, userEmail) => {
//   const tokenEmail = jwt.sign({ id, verified: 'verified' }, "secret");
  transporter.sendMail({
    subject: 'Verifica tu Email de Bait!!',
    from: email,
    to: userEmail,
    html: `<h1>Verifica tu email</h1>
      <a href="https://witty-mud-0bdbce610.3.azurestaticapps.net/validate/${token}">verifica tu email</a>`,
  });
};

module.exports = { sendVerificationEmail };