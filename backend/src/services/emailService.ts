import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "smtp.office365.com",
  host: "smtp.office365.com",
  port: 587,
    auth: {
      user: process.env.NO_REPLY_EMAIL_USER,    
      pass: process.env.NO_REPLY_EMAIL_PASSWORD,
    },
  });

export const sendOTPEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: process.env.NO_REPLY_EMAIL_USER,
        to,
        subject: "Your Mockable.dev Verification Code",
        text: `Your verification code is: ${otp}`,
    }
    console.log("OTP Sent")
    await transporter.sendMail(mailOptions)
}