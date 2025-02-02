export const streamChat = async (userPrompt: string) => {
  if (!userPrompt) {
    return null;
  }

  const response = await fetch('/api/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userPrompt }),
  });
const res = await response.text()
  if (!response.ok) {
    throw new Error('Failed to fetch chat response');
  }
console.log('res', res)

  return response.body;
};