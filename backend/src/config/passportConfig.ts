// src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, StrategyOptions, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { Strategy as LocalStrategy, IStrategyOptions as LocalStrategyOption } from 'passport-local';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import generateUserSlug from '../utils/generateUserSlug';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: false, 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const displayName = profile.displayName;

        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Check if a user with this email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser);
        }

        // If not, create a new user
        const randomPassword = Math.random().toString(36).substring(2, 15);
        let username = displayName.replace(/\s+/g, '').toLowerCase();
        let userSlug = generateUserSlug(username);
        while (await User.findOne({ userSlug })) {
          userSlug = generateUserSlug(username);
        }

        const newUser = new User({
          username,
          email,
          password: randomPassword,
          userSlug,
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Local Strategy Options – using "username" field (or email) for login
const localOptions: LocalStrategyOption = {
  usernameField: 'username',
  passwordField: 'password',
};

passport.use(
  new LocalStrategy(
    localOptions,
    async (username: string, password: string, done: any) => {
      try {
        // Find user by username or email.
        const user = await User.findOne({
          $or: [{ username }, { email: username }],
        });
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


export default passport;
