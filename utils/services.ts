import { createHash } from "crypto";

export function generateHashString(text: string) {
    const hash = createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
  }
  
  export function generateRandomString(length = 10) {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
  }
  
  
  export const copyToClipboard = (text : string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
    } else {
      // Fallback method for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Could not copy text: ', err);
      }
      document.body.removeChild(textarea);
    }
  };