require('dotenv').config();
const nodemailer = require('nodemailer');

class NotificationController {
    async sendNotification (notifDetails, email, recieverName, recieverRole) {

        if(recieverRole == 'Patient') {
            appointmentWith = `Dr. ${appointmentWith}`;
        }

        let text = `Dear ${recieverName},

        This is a reminder that you have an upcoming appointment with ${appointmentWith} in one hour. Please ensure you are prepared and ready at the scheduled time.
        
        Appointment Details:
        - Date and Time: ${notifDetails.date} , ${notifDetails.time}
        - Session Location: ${notifDetails.location}
        
        If you need to reschedule, you can do so through our website.
        
        Best regards,
        MantraCare Team`;

        let html = `<b>Dear ${recieverName},</b><br><br>
        This is a reminder that you have an upcoming appointment with ${appointmentWith} in one hour. Please ensure you are prepared and ready at the scheduled time.<br><br>
        <b>Appointment Details:</b><br>
        - <b>Date and Time:</b> ${notifDetails.date} , ${notifDetails.time}<br>
        - <b>Session Location</b> ${notifDetails.location}<br><br>
        If you need to reschedule, you can do so through our online portal.<br><br>
        Best regards,<br>
        <span style="color: blue;"><b>MantraCare Team</b></span>`
    
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
        
        const info = await transporter.sendMail({
            from: {
                name: 'MantraCare',
                address: process.env.EMAIL,
            },// sender address
            to: email, // list of receivers
            subject: "Upcoming Appointment Reminder", // Subject line
            text: text, // plain text body
            html: html, // html body
        });
        console.log('message sent:' + info.messageId)
        
    }
}

module.exports = NotificationController;
