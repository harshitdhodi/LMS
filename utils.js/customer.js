require('dotenv').config(); // Load environment variables

const nodemailer = require('nodemailer');
const { getEmailTemplate } = require('./mailFormate'); // Adjust path as necessary

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or any other email service provider
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is set correctly
    pass: process.env.EMAIL_PASS, // Ensure this is set correctly
  },
});

// Function to send email
const sendEmail = async (to, subject, name,password, email) => {
  try {
    // Generate HTML content from the template
    const htmlContent = getEmailTemplate(name , email,password);
  
    // Send email
    await transporter.sendMail({
      from:'Harshit Dhodi',
      to,
      subject,
      html: htmlContent, // Use 'html' for HTML emails
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendEmail,
};
