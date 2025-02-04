export const streamChat = async (userPrompt: string, onChunkReceived: (chunk: string) => void) => {
  if (!userPrompt) {
    throw new Error('No prompt provided');
  }

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b', // Replace with your model name
        messages: [{ role: 'user', content: userPrompt }],
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get reader from response');
    }

    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const parsedChunk = JSON.parse(chunk); // Parse the JSON chunk
      const content = parsedChunk.message?.content || '';

      accumulatedResponse += content;
      onChunkReceived(content); // Call the callback with the new chunk
    }

    return accumulatedResponse; // Return the full response once streaming is complete
  } catch (error) {
    console.error('Error streaming chat:', error);
    throw error;
  }
};