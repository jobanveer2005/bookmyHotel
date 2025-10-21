const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const nodemailer = require('nodemailer'); 

// @route   POST api/auth/register
// @desc    Register a user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare submitted password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. If credentials are correct, create JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // 4. Sign the token and send it back
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 36000 }, // 10 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/forgot-password
// @desc    Send a password reset link to the user's email
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // For security, we don't reveal that the user does not exist
            return res.status(200).json({ msg: 'Email sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to user model
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiration to 1 hour from now (more reasonable time)
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

        await user.save();

        // Construct reset URL (points to your FRONTEND app)
        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;

        // Use nodemailer to send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS,
            },
        });

        const mailOptions = {
            from: `BookMyHotel <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        };

        await transporter.sendMail(mailOptions);
        
        console.log(`Reset token generated for ${email}: ${resetToken}`);
        console.log(`Reset URL: ${resetUrl}`);

        res.json({ msg: 'Email sent' });
    } catch (err) {
        console.error(err.message);
        // Clear token fields on error
        const user = await User.findOne({ email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/auth/reset-password/:token
// @desc    Reset the user's password
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        console.log(`Attempting to reset password with token: ${resetToken}`);
        
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        console.log(`Looking for user with hashed token: ${resetPasswordToken}`);

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            console.log('No user found with this token or token expired');
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        console.log(`Found user: ${user.email}, token expires at: ${new Date(user.resetPasswordExpire)}`);

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/auth/reset-password/:resetToken
// @desc    Simple HTML page to reset password (backend fallback if frontend route is missing)
exports.resetPasswordPage = async (req, res) => {
    const { resetToken } = req.params;
    const apiBase = `${req.protocol}://${req.get('host')}`;
    res.set('Content-Type', 'text/html');
    return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset Password</title>
  <style>
    :root { --bg:#0f172a; --card:#111827; --muted:#9ca3af; --accent:#22c55e; --danger:#ef4444; }
    html,body{height:100%;margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";}
    body{display:flex;align-items:center;justify-content:center;background:radial-gradient(1200px 600px at 50% -200px,#1f293780,transparent) no-repeat,var(--bg);color:#e5e7eb}
    .card{width:100%;max-width:420px;background:linear-gradient(180deg,#0b1224 0%, #0b1224 60%, #0b1224cc),linear-gradient(135deg,#1f2937 0%,#0b1224 100%);border:1px solid #1f2937;border-radius:16px;box-shadow:0 10px 30px rgb(0 0 0 / 40%);padding:28px}
    h1{margin:0 0 8px 0;font-size:22px}
    p{margin:0 0 18px 0;color:var(--muted);font-size:14px}
    label{display:block;margin:12px 0 6px 0;color:#cbd5e1;font-size:13px}
    input{width:100%;padding:12px 14px;background:#0b1224;border:1px solid #1f2937;border-radius:10px;color:#e5e7eb}
    input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px rgb(37 99 235 / 20%)}
    .btn{margin-top:16px;width:100%;padding:12px 14px;border:none;border-radius:10px;background:linear-gradient(90deg,#22c55e,#16a34a);color:#052e16;font-weight:700;cursor:pointer}
    .btn[disabled]{opacity:.6;cursor:not-allowed}
    .msg{margin-top:12px;font-size:13px}
  </style>
  <script>
    async function handleSubmit(e){
      e.preventDefault();
      const password = document.getElementById('password').value.trim();
      const confirm = document.getElementById('confirm').value.trim();
      const msg = document.getElementById('msg');
      msg.textContent = '';
      if(!password || password.length < 6){ msg.style.color = '#ef4444'; msg.textContent = 'Password must be at least 6 characters.'; return; }
      if(password !== confirm){ msg.style.color = '#ef4444'; msg.textContent = 'Passwords do not match.'; return; }
      const btn = document.getElementById('submitBtn');
      btn.disabled = true; btn.textContent = 'Resetting...';
      try{
        const res = await fetch('${apiBase}/api/auth/reset-password/${resetToken}',{ method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
        const data = await res.json().catch(()=>({}));
        if(!res.ok){ throw new Error(data.msg || 'Failed to reset password'); }
        msg.style.color = '#22c55e'; msg.textContent = 'Password reset successful. You can close this tab.';
        document.getElementById('form').reset();
      }catch(err){ msg.style.color = '#ef4444'; msg.textContent = err.message || 'Something went wrong.'; }
      finally{ btn.disabled = false; btn.textContent = 'Reset Password'; }
    }
  </script>
  </head>
  <body>
    <div class="card">
      <h1>Reset your password</h1>
      <p>Enter a new password for your account.</p>
      <form id="form" onsubmit="handleSubmit(event)">
        <label for="password">New password</label>
        <input id="password" type="password" minlength="6" required placeholder="••••••••" />
        <label for="confirm">Confirm password</label>
        <input id="confirm" type="password" minlength="6" required placeholder="••••••••" />
        <button id="submitBtn" type="submit" class="btn">Reset Password</button>
      </form>
      <div id="msg" class="msg"></div>
    </div>
  </body>
</html>`);
};