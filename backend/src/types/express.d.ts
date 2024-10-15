import { User } from '../models/User'; // Adjust the path based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace 'User' with your actual user type
    }
  }
}
