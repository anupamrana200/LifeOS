import asyncHandler from '../utils/asyncHandler.js';

import { chatService, messageService } from '../services/chat/index.js';

/*
|--------------------------------------------------------------------------
| Chat CRUD
|--------------------------------------------------------------------------
*/

export const createChatController = asyncHandler(
  async (req, res) => {
    const { provider = 'openai' } = req.body;

    const allowedProviders = [
      'openai',
      'gemini',
    ];

    if (!allowedProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider.',
      });
    }

    const chat = await chatService.create({
      owner: req.user.id,
      provider,
    });

    res.status(201).json({
      success: true,
      message: 'Chat created successfully.',
      data: chat,
    });
  },
);

export const getChatsController = asyncHandler(
  async (req, res) => {
    const chats = await chatService.getAll(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: chats,
    });
  },
);

export const getChatController = asyncHandler(
  async (req, res) => {
    const chat = await chatService.getById({
      chatId: req.params.chatId,
      owner: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  },
);

export const deleteChatController = asyncHandler(
  async (req, res) => {
    const deleted = await chatService.delete({
      chatId: req.params.chatId,
      owner: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully.',
    });
  },
);

/*
|--------------------------------------------------------------------------
| Messages (Temporary)
|--------------------------------------------------------------------------
*/

export const sendMessageController = asyncHandler(
  async (req, res) => {
    const { message } = req.body;

    const result =
      await messageService.send({
        chatId: req.params.chatId,
        userId: req.user.id,
        message,
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  },
);


export const getMessagesController =
  asyncHandler(async (req, res) => {

    const messages =
      await messageService.getMessages({
        chatId: req.params.chatId,
        userId: req.user.id,
      });

    res.status(200).json({
      success: true,
      data: messages,
    });

  });


  export const streamMessageController =
  asyncHandler(async (req, res) => {

    res.setHeader(
      'Content-Type',
      'text/event-stream',
    );

    res.setHeader(
      'Cache-Control',
      'no-cache',
    );

    res.setHeader(
      'Connection',
      'keep-alive',
    );

    res.flushHeaders();
    let clientDisconnected = false;

    req.on('close', () => {
      clientDisconnected = true;

      console.log(
        '[SSE] Client disconnected.'
      );
    });

    try {

      await messageService.stream({
        chatId: req.params.chatId,
        userId: req.user.id,
        message: req.body.message,

        async onToken(token) {

            if (clientDisconnected) {
              return;
            }
            console.log("TOKEN:", token);
            res.write(
              `data: ${JSON.stringify({
                token,
              })}\n\n`
            );

          }
      });

      if (!clientDisconnected) {

        res.write(
          `data: ${JSON.stringify({
            done: true,
          })}\n\n`
        );

      }

    } catch (error) {

      res.write(
        `data: ${JSON.stringify({
          error: error.message,
        })}\n\n`
      );

    } finally {

      if (!clientDisconnected) {
        res.end();
      }

    }

  });


  