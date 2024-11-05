import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');
import auth from '../middleware/auth';

const router: Router = express.Router();

function generateUserSlug(username: string) {
  // Generate a UUID
  const uuid = uuidv4();

  // Create a SHA-256 hash and truncate it to, say, 8 characters
  const hash = crypto.createHash('sha256').update(uuid).digest('hex').slice(0, 8);

  return `${username.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${hash}`;
}

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    let userSlug = generateUserSlug(username);
    while (await User.findOne({ userSlug: userSlug })) {
      userSlug = generateUserSlug(username);
    }

    // Create a new user instance
    const newUser = new User({ username, password, email, userSlug: userSlug });

    // Save the user to the database
    const savedUser = await newUser.save();

    console.log(savedUser)

    // Generate JWT Token
    const payload = {
      userId: savedUser._id,
      username: savedUser.username,
      userSlug: savedUser.userSlug,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(201).json({ token, user: { username: savedUser.username, email: savedUser.email, userSlug: savedUser.userSlug } });
  } catch (err: any) {
    console.error("Signup error:", err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Handle other errors
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
   
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Generate JWT Token
    const payload = {
      userId: user._id,
      username: user.username,
      userSlug: user.userSlug,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(200).json({ token });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/me', auth, async (req: Request, res: Response) => {
  try {
    // Access the user ID from the authenticated request
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authorized.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: user });
  } catch (err: any) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;