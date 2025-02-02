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

  if (!response.ok) {
    throw new Error('Failed to fetch chat response');
  }

  return response.body; // Return the ReadableStream directly
};