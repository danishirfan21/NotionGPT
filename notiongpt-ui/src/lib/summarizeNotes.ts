import { OpenAI } from 'openai';
import type { Descendant } from 'slate';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function extractTextFromSlate(nodes: Descendant[]): string {
  const lines: string[] = [];

  function visit(node: Descendant) {
    if ('text' in node) {
      lines.push(node.text);
    } else if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }

  for (const node of nodes) {
    visit(node);
    lines.push(''); // new line between blocks
  }

  return lines.join('\n').trim();
}

export async function summarizeNotes(notes: Descendant[]): Promise<string> {
  const content = extractTextFromSlate(notes);

  if (!content || content.length < 10) {
    return "There isn't enough content to summarize.";
  }

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarizes user notes into a concise overview. Include key insights in a friendly tone.',
        },
        { role: 'user', content },
      ],
      temperature: 0.7,
    });

    const summary = chat.choices?.[0]?.message?.content?.trim();
    return summary || 'No summary was returned by the AI.';
  } catch (error: unknown) {
    console.error('OpenAI GPT-4o summarization error:', error);
    return 'An error occurred while summarizing the notes.';
  }
}
