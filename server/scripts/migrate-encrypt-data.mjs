import connectDB, { disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Document from '../src/models/Document.js';
import Chat from '../src/models/chat.model.js';
import Message from '../src/models/message.model.js';
import Session from '../src/models/Session.js';
import { blindIndex, encryptJson, encryptText, isEncrypted } from '../src/services/encryption.service.js';

const encryptField = (record, field, context) => {
  if (record[field] !== null && record[field] !== undefined && !isEncrypted(record[field])) record[field] = encryptText(record[field], context);
};

const migrate = async (Model, transform) => {
  const records = await Model.find({});
  for (const record of records) {
    if (transform(record)) await record.save();
  }
};

await connectDB();
try {
  await migrate(User, (user) => {
    const before = `${user.fullName}|${user.email}`;
    const plaintextEmail = isEncrypted(user.email) ? null : user.email;
    encryptField(user, 'fullName', 'user.fullName');
    encryptField(user, 'email', 'user.email');
    if (plaintextEmail && !user.emailHash) user.emailHash = blindIndex(plaintextEmail, 'user.email');
    return before !== `${user.fullName}|${user.email}` || Boolean(plaintextEmail && !user.emailHash);
  });
  await migrate(Document, (document) => {
    const before = `${document.title}|${document.description}|${document.originalFileName}|${document.aiResult}|${document.aiMetadata}`;
    encryptField(document, 'title', 'document.title');
    encryptField(document, 'description', 'document.description');
    encryptField(document, 'originalFileName', 'document.filename');
    document.tags = (document.tags || []).map((tag) => isEncrypted(tag) ? tag : encryptText(tag, 'document.tag'));
    if (document.aiResult && !isEncrypted(document.aiResult)) document.aiResult = encryptJson(document.aiResult, 'document.aiResult');
    if (document.aiMetadata && !isEncrypted(document.aiMetadata)) document.aiMetadata = encryptJson(document.aiMetadata, 'document.aiMetadata');
    return before !== `${document.title}|${document.description}|${document.originalFileName}|${document.aiResult}|${document.aiMetadata}`;
  });
  await migrate(Chat, (chat) => {
    if (isEncrypted(chat.title)) return false;
    chat.title = encryptText(chat.title, 'chat.title');
    if (!chat.model) chat.model = chat.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-5-mini';
    return true;
  });
  await migrate(Message, (message) => {
    if (isEncrypted(message.content)) return false;
    message.content = encryptText(message.content, 'chat.message');
    return true;
  });
  await migrate(Session, (session) => {
    const before = `${session.ipAddress}|${session.userAgent}|${session.browser}|${session.operatingSystem}|${session.deviceName}`;
    encryptField(session, 'ipAddress', 'session.ipAddress');
    encryptField(session, 'userAgent', 'session.userAgent');
    encryptField(session, 'browser', 'session.browser');
    encryptField(session, 'operatingSystem', 'session.operatingSystem');
    encryptField(session, 'deviceName', 'session.deviceName');
    return before !== `${session.ipAddress}|${session.userAgent}|${session.browser}|${session.operatingSystem}|${session.deviceName}`;
  });
  console.log('Encryption migration completed.');
} finally {
  await disconnectDB();
}
