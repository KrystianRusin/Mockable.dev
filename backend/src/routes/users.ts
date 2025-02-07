// src/routes/users.ts
import express, { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import generateUserSlug from '../functions/generateUserSlug';
import { generateOTP } from '../functions/generateOTP';
import { sendOTPEmail } from '../services/emailService';
import auth from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';
import redisClient from '../redisClient';

const router: Router = express.Router();

router.post('/request-otp', auth, async (req: Request, res: Response) => {
  console.log("request for otp received")
  try{
    
    const {email} = req.body;
    
    // Get 6-digit OTP
    const otp = generateOTP();

    await redisClient.set(`otp:${email}`, otp, 'EX', 300)

    await sendOTPEmail(email, otp)

    res.status(200).json({message: "OTP sent to email"})
  } catch (error) {
    console.error('Error in request-otp', error);
    res.status(500).json({message: 'Server error while requesting OTP.'});
  }
})

router.post('/verify-otp', auth, async(req:Request, res:Response) => {
  try {
    
    const { email, otp } = req.body;
    console.log(otp)
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Retrieve and validate OTP
    const storedOtp = await redisClient.get(`otp:${email}`);
    console.log(storedOtp)
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP not requested or expired." });
    }

    if(storedOtp != otp) {
      return res.status(400).json({ message: "OTP Invalid." });
    }

    // OTP is valid so we delete it from Redis
    await redisClient.del(`otp:${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const payload = {
      userId: user._id,
      username: user.username,
      userSlug: user.userSlug,
      email: user.email
    };

    const token = jwt.sign({ ...payload, mfa: true }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(200).json({token})
  } catch (error){
    console.log("Erorr in verify-otp", error)
    res.status(500).json({message: 'Server error while requesting OTP.'});
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    let userSlug = generateUserSlug(username);
    while (await User.findOne({ userSlug })) {
      userSlug = generateUserSlug(username);
    }

    // Create a new user instance
    const newUser = new User({ username, password, email, userSlug });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // Generate JWT Token
    const payload = {
      userId: savedUser._id,
      email: savedUser.email,
      username: savedUser.username,
      userSlug: savedUser.userSlug,
    };

    const preMfaToken = jwt.sign({ ...payload, mfa: false }, process.env.JWT_SECRET as string, {
      expiresIn: '10m', 
    });
    res.status(201).json({
      mfaRequired: true, 
      token: preMfaToken,
      user: { username: savedUser.username, email: savedUser.email, userSlug: savedUser.userSlug }
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Local Login Route using Passport's local strategy
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: 'Server Error' });
    }
    if (!user) {
      return res.status(400).json({ message: info?.message || 'Login failed.' });
    }
    const payload = {
      userId: user._id,
      email: user.email,
      username: user.username,
      userSlug: user.userSlug,
    };
    const preMfaToken = jwt.sign({ ...payload, mfa: false}, process.env.JWT_SECRET as string, {
      expiresIn: '10m', 
    });
    return res.status(200).json({ mfaRequired: true, token: preMfaToken });
  })(req, res, next);
});

router.get('/me', auth, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'User not authorized.' });
  }
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  res.status(200).json({ user });
});

// ---------------------
// Google OAuth Routes
// ---------------------

// Start the Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req: Request, res: Response) => {
    // Successful authentication
    const user = req.user as any;
    const payload = {
      userId: user._id,
      username: user.username,
      userSlug: user.userSlug,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/home?token=${token}`);
  }
);

export default router;
