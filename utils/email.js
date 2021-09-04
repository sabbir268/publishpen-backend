const nodemailer = require("nodemailer");

exports.send = (to, subject, body = "", attachments = []) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
            user: "sabbir.ssgbd@gmail.com",
            pass: "S@bbir112358",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
        from: "info@publishpen.com",
        to,
        subject,
        html: body,
        attachments,
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("Email err:" + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};