const mailSender = require('./utils/mailSender');
require('dotenv').config();

(async () => {
  try {
    const testEmail = process.env.MAIL_USER; // send to configured MAIL_USER
    const res = await mailSender(testEmail, 'Test Email from EduPoint', '<p>This is a test email</p>');
    console.log('RESULT:', res);
  } catch (err) {
    console.error('ERROR:', err);
  }
})();