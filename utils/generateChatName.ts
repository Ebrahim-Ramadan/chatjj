import ollama from 'ollama'

export const generateChatName =async ({chat} : {chat:string}) => {
    const response = await ollama.chat({
        model: 'deepseek-r1:1.5b',
        messages: [{ role: 'user', content: `just gimme 3-word sum for: '}${chat}' no more than three words, just 3 and do not think`, }],
      })
      return response.message.content.replace(/<think>.*?<\/think>/s, '').trim().replace(/[^\w\s]/g, '').split(',')[0].replace(/[^\w\s]/g, '');
}