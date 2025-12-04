const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API
);

exports.sendOtpToEmail = async (email, otp) => {
  await apiInstance.sendTransacEmail({
    sender: { email: "noreply@gotrip.com", name: "GoTrip AI" },
    to: [{ email }],
    subject: "Your GoTrip Verification Code",
    htmlContent: `<h2>Your OTP is: <strong>${otp}</strong></h2>`,
  });
};
