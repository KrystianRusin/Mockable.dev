# Use official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose the port the backend runs on
EXPOSE 5000

# Start the backend
CMD ["node", "dist/index.js"]
