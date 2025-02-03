export function generateUUID(): number {
  const timestamp = parseInt(Date.now().toString(36), 36); // Convert base-36 timestamp to an integer
  const random = parseInt(Math.random().toString(36).substring(2, 6), 36) || 0; // Convert base-36 random string to integer
  return timestamp * 100000 + random; // Scale up timestamp to ensure uniqueness
}
