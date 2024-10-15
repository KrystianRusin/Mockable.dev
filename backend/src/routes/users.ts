import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Create a new user instance
    const newUser = new User({ username, password, email });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate JWT Token
    const payload = {
      userId: savedUser._id,
      username: savedUser.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    res.status(201).json({ token });
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


export default router;