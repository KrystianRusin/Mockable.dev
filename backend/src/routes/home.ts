// backend/src/routes/home.ts
import express, { Router, Request, Response } from 'express';
import auth from '../middleware/auth';

const router: Router = express.Router();

router.get('/home', auth, (req: Request, res: Response) => {
  res.status(200).json({ message: `Welcome ${req.user?.username}!` });
});

export default router;

