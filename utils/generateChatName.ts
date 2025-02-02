import ollama from 'ollama'

export const generateChatName =async ({chat} : {chat:string}) => {
    const response = await ollama.chat({
        model: 'deepseek-r1:1.5b',
        messages: [{ role: 'user', content: `just gimme 3-word sum for: '}${chat}' no more than three words, just 3 and do not think`, }],
      })
      console.log(response.message.content.replace(/<think>.*?<\/think>/s, '').trim().split(',')[0])
}