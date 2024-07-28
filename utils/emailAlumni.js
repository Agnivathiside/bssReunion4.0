import nodemailer from "nodemailer";

export const sendMailToAlumni = async (email, Name, registration_id) => {
    const lis = Name.split(" ")
    const lastName = lis[lis.length-1]

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BSS School Alumni Association</title>
</head>
<body>
    <p>Dear Ms. ${lastName},</p>
    <p>We are delighted to welcome you as an official registered member of The BSS School Alumni Association. Your unique registration ID is provided below:</p>
    <p><strong>${registration_id}</strong></p>
    <p>Please keep this ID safe for all your future participations in our alumni events.</p>
    <p>Thank you once again for joining us.</p>
    <p>Best regards,</p>
    <p>The BSS School Alumni Association</p>
</body>
</html>
`
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
        subject: 'Welcome to The BSS School Alumni Association',
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}