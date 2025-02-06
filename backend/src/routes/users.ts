// src/routes/users.ts
import express, { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import generateUserSlug from '../utils/generateUserSlug';
import auth from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';

const router: Router = express.Router();


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
      username: savedUser.username,
      userSlug: savedUser.userSlug,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(201).json({
      token,
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
      username: user.username,
      userSlug: user.userSlug,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
    return res.status(200).json({ token });
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
