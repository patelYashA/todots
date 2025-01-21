const nodemailer = require('nodemailer');
import { environment } from "../utils/environment";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

const sendEmailReminder = (userEmail: string, taskName: string, reminderTime: Date): void => {
  const transporter: any = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: environment.myemail.email,
      pass: environment.myemail.password,
    },
  });

  const mailOptions: MailOptions = {
    from: environment.myemail.email,
    to: userEmail,
    subject: `Reminder: ${taskName}`,
    text: `Reminder: Your task "${taskName}" is due at ${reminderTime}.`,
  };

  transporter.sendMail(mailOptions, (err: any, info: any) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export default sendEmailReminder;
