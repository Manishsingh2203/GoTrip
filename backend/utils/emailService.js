const axios = require('axios');
const config = require('../config/env');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // ✅ FIX: Use the correct config path from your updated env.js
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
          'api-key': config.email.brevoApiKey, // ✅ FIX: Updated config path
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Email sent successfully to:', to);
    return response.data;
  } catch (error) {
    console.error('❌ Email sending failed:', error.response?.data || error.message);
    throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = sendEmail;