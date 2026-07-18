import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';


import {
  createChatController,
  deleteChatController,
  getChatController,
  getChatsController,
  sendMessageController,
  getMessagesController,
  streamMessageController
} from '../controllers/chat.controller.js';

const router = Router();

router.use(protect);

/*
|--------------------------------------------------------------------------
| Chat
|--------------------------------------------------------------------------
*/

router.post('/', createChatController);

router.get('/', getChatsController);

router.get('/:chatId', getChatController);

router.delete('/:chatId', deleteChatController);

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

router.post(
  '/:chatId/messages',
  sendMessageController,
);

router.get(
  '/:chatId/messages',
  getMessagesController,
);
export default router;

router.post(
  '/:chatId/messages/stream',
  streamMessageController,
);