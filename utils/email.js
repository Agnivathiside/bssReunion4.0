import nodemailer from 'nodemailer';
import fs from 'fs';

export const sendEmailWithAttachment = async (email, name, attachmentPath) => {
  const lis = name.split(" ")
  const lastName = lis[-1];
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation and QR Code for Milan Pass</title>
</head>
<body>
    <p>Subject: Confirmation and QR Code for Milan Pass</p>
    <p>Dear Ms ${lastName},</p>
    <p>I hope this message finds you in good health. On behalf of The BSS Alumni, I extend our warmest greetings to you.</p>
    <p>Thank you for expressing your interest in our upcoming event. We are pleased to confirm your participation and look forward to welcoming you.</p>
    <p><strong>Date:</strong> 29th September, 2024</p>
    <p><strong>Venue:</strong> The BSS School</p>
    <p><strong>Dress Code:</strong> Timeless Elegance (Note: Show up in styles from your favourite decade between the ’50s and today, or light up the party in elegant attire that reflects the timeless nature of MILAN.)</p>
    <p>Kindly find attached your unique QR code for your Milan Pass. Please present this QR code at the entrance on the event day to collect your Pass.</p>
    <p>Please feel free to contact us for any further queries.</p>
    <p>Thank you once again for your participation and we look forward to seeing you at the event.</p>
    <p>Best regards,</p>
    <p>The BSS School Alumni Association</p>
</body>
</html>
`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: email,
    subject: 'Milan Pass!',
    html: htmlContent,
    attachments: [
      {
        filename: `composite_${email}.png`,
        path: attachmentPath,
        cid: 'unique@qr.code'
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);

    fs.unlink(attachmentPath, (err) => {
      if (err) {
        console.error('Error deleting the composite image file:', err);
      }
    });
  });
};
