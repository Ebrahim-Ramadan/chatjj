import { createHash } from "crypto";

export function generateHashString(text: string) {
    const hash = createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
  }
  
  export function generateRandomString(length = 10) {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
  }
  
  