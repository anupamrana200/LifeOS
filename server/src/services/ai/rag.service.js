import retrievalService from './retrieval/retrieval.service.js';
import { buildRetrievalPrompt } from './prompts/retrieval.prompt.js';

import { generationService } from './generation/index.js';
import { CHAT_SYSTEM_PROMPT } from './prompts/system.prompt.js';

class RagService {
  async chat({
    chatId,
    userId,
    question,
    provider,
    model,
    history = [],
  }) {
    const contexts = await retrievalService.retrieve({
      userId,
      question,
    });

    if (!contexts.length) {
      return {
        answer: "I couldn't find any relevant information.",
        sources: [],
      };
    }

    const conversation = history
      .map(message => `${message.role.toUpperCase()}: ${message.content}`)
      .join('\n\n');

    const prompt = buildRetrievalPrompt({
      question,
      history: conversation,
      contexts: contexts.map(context => context.content),
    });

    const response = await generationService.generate({
      provider,
      model,
      messages: [
        {
          role: 'system',
          content: CHAT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      answer: response.text,
      sources: contexts.map(source => ({
        documentId: source.documentId,
        score: Number(source.score.toFixed(3)),
      })),
      usage: response.usage,
      provider: response.provider,
      model: response.model,
    };
  }

  async stream({
    userId,
    question,
    provider,
    model,
    history = [],
    onToken,
  }) {

    const contexts =
      await retrievalService.retrieve({
        userId,
        question,
      });

    if (!contexts.length) {

      const answer =
        "I couldn't find any relevant information.";

      if (onToken) {
        await onToken(answer);
      }

      return {
        answer,
        sources: [],
      };
    }

    const conversation =
      history
        .map(
          message =>
            `${message.role.toUpperCase()}: ${message.content}`
        )
        .join('\n\n');

    const prompt =
      buildRetrievalPrompt({
        question,
        history: conversation,
        contexts: contexts.map(
          context => context.content,
        ),
      });

    const response =
      await generationService.generateStream({
        provider,
        model,
        messages: [
          {
            role: 'system',
            content: CHAT_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        onToken,
      });

    return {
      answer: response.text,
      sources: contexts.map(source => ({
        documentId: source.documentId,
        score: Number(source.score.toFixed(3)),
      })),
      usage: response.usage,
      provider: response.provider,
      model: response.model,
    };

  }
}

export default new RagService();
