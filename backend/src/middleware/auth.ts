import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Define the payload shape from your JWT token.
export interface AuthPayload {
  userId: string;
  username: string;
  userSlug: string;
}

// Extend the Express Request to include our custom user property.
export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

const auth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    // Cast req to our AuthenticatedRequest and attach the decoded token.
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};

export default auth;
