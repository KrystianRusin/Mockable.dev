import express, { Router, Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

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
    console.log("newUser", newUser);

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // Respond with the saved user (excluding the password)
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(201).json(userResponse);
  } catch (err: any) {
    console.error("Signup error:", err);

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Handle other errors
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
