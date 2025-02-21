# Mockable.dev API Mocking Service

**Mockable.dev** is a API mocking service designed for developers who need to quickly create and test custom API endpoints. The platform allows users to define endpoints with custom JSON schemas, generate mock responses (including GPT-powered responses), and also allows users to validate JSON data. Built with React, Express, and MongoDB, hosted on AWS (Still undergoing development)

Website hosted at [mockable.dev](https://mockable.dev/)

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **User Authentication:**  
  - Local login/signup with JWT token-based authentication.
  - Google OAuth integration for streamlined authentication.
  - Multi-Factor Authentication (MFA) via email OTP.

- **API Endpoint Mocking:**  
  - Create and manage custom API endpoints.
  - Define endpoint responses using JSON schemas.
  - Generate dynamic, GPT-powered responses based on user-provided JSON schemas.

- **JSON Schema Validator:**  
  - Validate JSON data against user-defined schemas.
  - Immediate visual feedback on schema validity.

- **Protected Routes:**  
  - Secure areas of the application using JWT and custom ProtectedRoute components in React.

- **Error Handling:**  
  - Comprehensive error management on both client and server.
  - Clear messaging for authentication, schema validation, and general API errors.

- **Modern UI/UX:**  
  - Clean, responsive design built with Material UI.
  - Interactive dashboard with quick actions and detailed statistics.

---

## Technology Stack

- **Frontend:**  
  - React (with TypeScript)
  - React Router
  - Material UI
  - Vite (development build tool)

- **Backend:**  
  - Node.js & Express (with TypeScript)
  - MongoDB (via Mongoose)
  - Passport for authentication (Local and Google OAuth)
  - JSON Web Tokens (JWT)
  - Nodemailer (for email/MFA integration)

- **Other Tools:**  
  - Redis (for caching and potential OTP storage)
  - AWS (planned production hosting)

---

## Installation and Setup for Local Deployement

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Redis (Used to cache generated responses, improving API response time)
- A Google Cloud account for OAuth credentials
- An Outlook/Office365 account (or similar) for sending emails via Nodemailer

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/mockable.dev.git
   cd mockable.dev/backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file in the root of the backend folder and add the following variables***
   ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/mockify_io_db
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=1h
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/google/callback
    FRONTEND_URL=http://localhost:3000
    EMAIL_USER=your_outlook_email@outlook.com
    EMAIL_PASSWORD=your_outlook_app_password
   ```
4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1.  **Navigate to the frontend directory:**

    `cd ../frontend`

2.  **Install dependencies:**

    `npm install
    # or
    yarn install`

3.  **Configure Vite Proxy (in `vite.config.ts`):**


    `import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          },
        },
      },
    });`

4.  **Start the frontend server:**

    `npm run dev
    # or
    yarn dev`


Environment Variables
---------------------

Make sure your `.env` file contains the following variables (adjust values as needed):

env

Copy

`PORT=5000
MONGO_URI=mongodb://localhost:27017/mockify_io_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/google/callback
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_outlook_email@outlook.com
EMAIL_PASSWORD=your_outlook_app_password`

* * * * *

Usage
-----

1.  **Sign Up / Login:**

    -   Navigate to the signup or login pages.
    -   Use local authentication or click the Google icon to authenticate via Google OAuth.
    -   For local login, if MFA is enabled, you will be redirected to the MFA page to verify your email OTP.
2.  **MFA Flow:**

    -   After a local login, you will be redirected to an MFA page where an OTP is sent to your registered email.
    -   Enter the OTP to complete the authentication process.
    -   Upon successful verification, your final JWT token is stored and you are granted access to the protected dashboard.
3.  **Dashboard:**

    -   Once authenticated, access the dashboard to create and manage API endpoints, validate JSON schemas, and monitor usage statistics.
4.  **Protected Routes:**

    -   The application uses ProtectedRoute components to ensure only authenticated users can access sensitive routes.
  
Future Improvements
-------------------

-   **Rate Limiting and Security:**\
    Implement rate limiting on authentication and API endpoints.
-   **Advanced Logging and Monitoring:**\
    Integrate a logging framework and monitoring tools.
-   **Add custom parameters to api endpoints**\
     Allow users to add custom parameters on their endpoints to better simulate real api calls
-   **Implement Stripe for payment processing as well as premium payment model**\
     Implement different subscription tiers which have different rate limits, gpt generated response limits, and maximum custom api endpoints 
-   **Endpoint Statistics and Dashboard**\
    Store endpoint data and update dashboard to display data about endpoints (e.g avg. response time, how many endpoints are created etc.)
