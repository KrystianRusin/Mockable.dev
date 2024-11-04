export interface User {
    username: string;
    email: string;
    password: string;
    userSlug: string;
    createdAt?: Date;
    updatedAt?: Date;
  }