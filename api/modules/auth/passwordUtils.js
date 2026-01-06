import * as crypto from 'crypto';
export function generateRandomPassword() {
    return crypto.randomBytes(12).toString('hex');
  }