const Payment = require('../models/Payment');
const User = require('../models/User');
const sendEmail = require('../utils/mail');
const crypto = require('crypto');

// @desc    Initiate payment and send OTP
// @route   POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, item } = req.body;
    const user = await User.findById(req.user.id);

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 2. Create pending payment record
    const payment = await Payment.create({
      user: req.user.id,
      amount,
      item,
      status: 'PENDING',
      otp,
      otpExpires,
      transactionId: crypto.randomBytes(12).toString('hex').toUpperCase()
    });

    // 3. Try to send email — in dev mode, fall back gracefully
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 40px; border-radius: 8px;">
        <h2 style="color: #E30000; letter-spacing: 2px;">PAYMENT VERIFICATION</h2>
        <p style="font-size: 1.1rem; color: #cccccc;">A security code was requested for your transaction on <strong>EliteTrack Performance</strong>.</p>
        <div style="background-color: #1a1a1a; padding: 20px; border: 1px solid #333; margin: 30px 0; text-align: center;">
          <span style="font-size: 3rem; font-weight: 900; letter-spacing: 12px; color: #E30000;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 0.9rem;">REASON: Purchase of <strong>${item}</strong> for <strong>LKR ${amount.toLocaleString()}</strong></p>
        <p style="color: #666; font-size: 0.9rem;">CODE EXPIRES IN: 10 MINUTES</p>
        <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;">
        <p style="font-size: 0.8rem; color: #444;">If you did not initiate this request, please secure your account immediately.</p>
      </div>
    `;

    let emailSent = false;
    const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_USER !== 'your_gmail@gmail.com';

    if (smtpConfigured) {
      try {
        await sendEmail({
          email: user.email,
          subject: `[EliteTrack] Payment OTP: ${otp}`,
          html
        });
        emailSent = true;
        console.log(`📧 OTP email sent to ${user.email}`);
      } catch (emailErr) {
        console.error('⚠️  Email send failed:', emailErr.message);
      }
    }

    // In development mode — always log OTP to console for testing
    if (process.env.NODE_ENV !== 'production' || !emailSent) {
      console.log(`\n🔐 ═══════════════════════════════`);
      console.log(`   DEV OTP for ${user.email}: ${otp}`);
      console.log(`   Item: ${item} | Amount: LKR ${amount}`);
      console.log(`   Payment ID: ${payment._id}`);
      console.log(`🔐 ═══════════════════════════════\n`);
    }

    const response = {
      success: true,
      message: emailSent
        ? `Verification OTP sent to ${user.email}`
        : 'OTP generated (email not configured — check server console for OTP)',
      paymentId: payment._id
    };

    // Return OTP in response ONLY in development when email not set up
    if (!emailSent && process.env.NODE_ENV !== 'production') {
      response.dev_otp = otp;
      response.dev_hint = 'Set SMTP_USER and SMTP_PASS in server/.env to enable email delivery';
    }

    res.json(response);
  } catch (err) {
    console.error('Payment initiate error:', err);
    res.status(500).json({ success: false, message: 'Could not initiate payment: ' + err.message });
  }
};

// @desc    Verify OTP and complete payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, otp } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user.id,
      status: 'PENDING'
    }).select('+otp +otpExpires');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Active payment session not found' });
    }

    // Check expiration
    if (payment.otpExpires < Date.now()) {
      payment.status = 'FAILED';
      await payment.save();
      return res.status(400).json({ success: false, message: 'OTP has expired. Please restart the request.' });
    }

    // Check OTP
    if (payment.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Success
    payment.status = 'COMPLETED';
    await payment.save();

    res.json({
      success: true,
      message: 'Payment verified and completed successfully',
      transactionId: payment.transactionId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
