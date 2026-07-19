export const mockConversations = Object.freeze([
  { id: 'conv-focus', provider: 'OpenAI', title: 'Plan a more focused work week', updatedAt: '12 min ago' },
  { id: 'conv-notes', provider: 'OpenAI', title: 'Summarize my project notes', updatedAt: 'Yesterday' },
  { id: 'conv-learning', provider: 'OpenAI', title: 'Personal learning plan ideas', updatedAt: '2 days ago' },
  { id: 'conv-research', provider: 'OpenAI', title: 'Research synthesis outline', updatedAt: 'Jul 14' },
]);

export const mockMessages = Object.freeze({
  'conv-focus': [
    { content: 'You are a helpful LifeOS assistant. Use the connected knowledge base when it becomes available.', id: 'msg-system-1', role: 'system', timestamp: '10:01 AM' },
    { content: 'Help me create a realistic plan for a more focused work week.', id: 'msg-user-1', role: 'user', timestamp: '10:02 AM' },
    {
      code: { content: 'const focusBlocks = [\n  \'Deep work\',\n  \'Collaboration\',\n  \'Review\',\n];', language: 'javascript' },
      content: 'Start by protecting a few clear focus blocks. Keep the plan intentionally small, then adjust it after your first week.',
      id: 'msg-assistant-1',
      role: 'assistant',
      timestamp: '10:02 AM',
    },
  ],
  'conv-notes': [
    { content: 'Summarize these notes into decisions, actions, and risks.', id: 'msg-user-2', role: 'user', timestamp: 'Yesterday' },
    { content: 'I can help structure that once your notes are available in the chat.', id: 'msg-assistant-2', role: 'assistant', timestamp: 'Yesterday' },
  ],
  'conv-learning': [],
  'conv-research': [
    { content: 'Create a research synthesis outline for my saved articles.', id: 'msg-user-3', role: 'user', timestamp: 'Jul 14' },
  ],
});

export const chatSuggestions = Object.freeze(['Explain this', 'Summarize', 'Write code', 'Fix bug', 'Translate']);

export const pinnedDocuments = Object.freeze(['Product strategy brief.pdf', 'Team meeting notes.docx']);
