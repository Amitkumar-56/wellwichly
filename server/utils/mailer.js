// server/utils/mailer.js

'use strict';
const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER || 'Wellwichly@gmail.com';
  let pass = process.env.SMTP_PASS;
  if (pass) {
    pass = String(pass).trim().replace(/\s+/g, '');
  }
  if (!host || !user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendOrderEmail({ to, subject, text, html, attachments }) {
  const transporter = createTransport();
  if (!transporter) {
    return { sent: false, reason: 'missing_smtp_config' };
  }
  const from = process.env.FROM_EMAIL || 'no-reply@wellwichly.com';
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments: attachments || [],
  });
  return { sent: true, messageId: info.messageId };
}

module.exports = { sendOrderEmail };
