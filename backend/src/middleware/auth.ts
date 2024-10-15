import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; username: string };

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export default auth;
