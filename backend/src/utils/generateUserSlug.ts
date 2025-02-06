const crypto = require('crypto');
const {v4: uuidv4} = require('uuid');

export default function generateUserSlug(username: string) {
    // Generate a UUID
    const uuid = uuidv4();
  
    // Create a SHA-256 hash and truncate it to, say, 8 characters
    const hash = crypto.createHash('sha256').update(uuid).digest('hex').slice(0, 8);
  
    return `${username.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${hash}`;
  }