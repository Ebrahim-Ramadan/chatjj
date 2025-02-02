import { NextResponse } from 'next/server';
import ollama from 'ollama';

export async function POST(req: Request) {
  const { userPrompt } = await req.json();

  if (!userPrompt) {
    return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const message = { role: 'user', content: userPrompt };
      const response = await ollama.chat({
        model: 'deepseek-r1:1.5b',
        messages: [message],
        stream: true,
      });

      for await (const part of response) {
        // Encode the response chunk as a Uint8Array
        const chunk = new TextEncoder().encode(part.message.content);
        controller.enqueue(chunk);
      }

      controller.close();
    },
  });

  // Return the stream as the response
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}