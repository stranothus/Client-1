const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const password = process.env['GMAIL_PASSWORD'];
const gmail = "bananablog001@gmail.com";


const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth : {
		user : gmail,
		pass : password
	}
});

/**
 * Sends mail
 * 
 * @param mailOptions {from : string, to : string, subject : string, text : string, html : string}
 * 
 * @returns {void}
 */
 function sendEmail(mailOptions) {
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) console.log(error);
	});
}

module.exports = sendEmail;