const axios = require('axios');
const config = require('../config/env');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // ✅ CORRECT: Using the proper config structure from your env.js
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { 
          email: config.email.fromEmail,
          name: 'GoTrip AI'
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      },
      {
        headers: {
          'api-key': config.email.brevoApiKey, // ✅ This matches your config
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Email sent successfully to:', to);
    return response.data;
  } catch (error) {
    console.error('❌ Email sending failed:', error.response?.data || error.message);
    
    // For development, simulate success even if email fails
    if (config.env === 'development') {
      console.log('🔧 Development mode: Email would have been sent to:', to);
      console.log('🔧 Subject:', subject);
      console.log('🔧 OTP in HTML:', html.match(/\d{6}/)?.[0] || 'OTP not found');
      return { message: 'Email simulated in development mode' };
    }
    
    throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = sendEmail;