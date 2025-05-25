import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function chatWithAI(prompt: string): Promise<string> {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `
        You are NotionGPT — an intelligent thought partner integrated into a user's workspace.
        
        - Help users think clearly, organize ideas, and make progress on goals.
        - Respond like a writing partner, not a chatbot. Avoid generic explanations.
        - When possible, structure ideas into outline form, bullet points, or action steps.
        - Keep answers concise, insightful, and tailored for saving into notes.
        - Use markdown for structure, but avoid over-formatting.
        - Always assume the user will store your reply in a document or use it to think better.
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return (
    chat.choices[0]?.message?.content?.trim() ?? 'AI did not return a response.'
  );
}
