# 🧠 LifeOS

> **Your AI-powered second brain**
> Securely organize documents, extract knowledge, and chat with your data in one intelligent workspace.

![Status](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express-5-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

---

## 📖 Overview

LifeOS is an AI-powered personal knowledge-management platform for securely storing, organizing, searching, and interacting with digital information. Upload documents, extract their text with OCR, and ask natural-language questions using OpenAI or Google Gemini.

Sensitive user data is encrypted at rest by the backend before it is written to MongoDB or the document-storage directory.

---

## ✨ Features

### 🔐 Authentication

- Secure registration and login
- Short-lived JWT access tokens and refresh tokens
- HTTP-only refresh-token cookies
- Protected routes and automatic token refresh
- Session management and logout

### 🛡️ Encrypted personal vault

- AES-256-GCM authenticated encryption for sensitive data at rest
- Uploaded file bytes stored as encrypted `.lifeos` files
- Sensitive MongoDB fields encrypted before storage
- Context-bound encryption to prevent ciphertext being used in the wrong data field
- HMAC-SHA-256 blind index for private email lookup without storing the plaintext email

### 📂 Document management

- Upload, organize, preview, download, rename, and delete documents
- OCR and text extraction for supported document types
- Processing and indexing status
- Encrypted document metadata and AI-generated summaries

### 🤖 AI assistant

- Chat with uploaded documents using RAG retrieval
- Context-aware answers with source references
- OpenAI and Google Gemini provider support
- Streaming responses
- Encrypted chat messages, titles, and retrieved vector-chunk text at rest

### 🔎 Search and modern UI

- Document, conversation, and application search
- Responsive React interface with light and dark themes
- Dashboard, profile, settings, notifications, and command palette

---

## 🔒 Encryption and privacy

### Encryption level

LifeOS currently uses **AES-256-GCM** for server-side encryption at rest:

- **Algorithm:** AES-256-GCM
- **Key strength:** 256-bit symmetric key
- **IV / nonce:** a newly generated random 96-bit IV for every encrypted value or file
- **Integrity protection:** 128-bit GCM authentication tag; modified ciphertext fails decryption
- **Context binding:** Additional Authenticated Data (AAD) binds ciphertext to its purpose, for example `document.file`, `chat.message`, or `user.email`
- **Stored formats:** encrypted text is stored with the `lifeos:v1:` prefix; encrypted uploaded files use the `.lifeos` format with a `LIFEOS` version header

### What is encrypted

- Original uploaded document bytes
- User names and email addresses
- Document titles, descriptions, original filenames, tags, AI results, summaries, and metadata
- Chat titles and user/assistant message content
- Session metadata such as IP address, user agent, browser, operating system, and device name
- Retrieved text stored in Pinecone vector metadata

Some operational metadata must remain available for normal application operation, such as IDs, ownership relationships, file MIME type, file size, timestamps, processing state, and vector embeddings.

### Key management

`DATA_ENCRYPTION_KEY` must be a cryptographically random **64-character hexadecimal string** (32 bytes). The application will use `FILE_ENCRYPTION_KEY` only as a compatibility fallback when `DATA_ENCRYPTION_KEY` is not supplied.

**Never commit either key to Git, send it to the client, or log it.** Keep it in the production server's secret store or protected environment configuration. Losing or changing the key without a controlled key-rotation and migration plan makes existing encrypted data unreadable.

Generate a key locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important security boundary

This is **server-side encryption at rest**, not end-to-end or zero-knowledge encryption. The LifeOS backend holds the key and decrypts data only when it must serve the authenticated user, process a document, retrieve RAG context, or call an AI provider. Plaintext sent to OpenAI or Gemini for requested AI processing is subject to that provider's applicable data-handling terms. Use HTTPS in production for data in transit.

---

## 🏗️ Tech stack

### Frontend

- React 19 and Vite
- React Router 7
- Tailwind CSS
- Axios
- React Hook Form
- Lucide React and React Hot Toast

### Backend

- Node.js 22
- Express 5
- MongoDB and Mongoose
- JWT, bcrypt, cookie-parser, Helmet, CORS, and Multer
- AES-256-GCM encryption using Node.js `crypto`

### AI, retrieval, and OCR

- OpenAI API
- Google Gemini API
- Pinecone vector database
- Tesseract OCR
- Poppler PDF rendering

### Deployment

- Oracle Cloud Ubuntu VM for the API
- Nginx reverse proxy and PM2
- MongoDB
- Vercel for the React frontend

---

## 📁 Project structure

```text
LifeOS/
├── client/                 # React/Vite frontend
│   ├── src/
│   ├── scripts/
│   └── vercel.json
├── server/                 # Express API
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── serializers/
│   ├── scripts/            # Data-encryption  migration scripts
│   └── src/uploads/encrypted/ # Default encrypted document storage
└── README.md
```

---

## 🚀 Getting started

### Clone the repository

```bash
git clone https://github.com/anupamrana200/LifeOS.git
cd LifeOS
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## ⚙️ Environment variables

### Client

```env
# Local development example
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=LifeOS
```

`VITE_*` variables are included in the browser build. They must never contain secrets. For production, configure `VITE_API_BASE_URL` as the HTTPS API URL, for example `https://api.example.com/api/v1`.

### Server

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=
CORS_ORIGIN=https://your-frontend-domain.example

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
COOKIE_SAME_SITE=none

# Required: 64 hexadecimal characters / 32 random bytes.
DATA_ENCRYPTION_KEY=
# Optional compatibility fallback only.
FILE_ENCRYPTION_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
DEFAULT_AI_PROVIDER=openai

PINECONE_API_KEY=
PINECONE_INDEX_NAME=
DOCUMENT_STORAGE_DIR=/absolute/path/to/lifeos-encrypted-documents
```

Keep production secrets outside the repository. Use a persistent, access-controlled volume for `DOCUMENT_STORAGE_DIR`; it contains encrypted `.lifeos` files.

---

## 🔐 Authentication flow

```text
User login
   │
   ▼
Backend verifies the bcrypt password hash
   │
   ▼
Issues a short-lived access token and refresh token
   │
   ▼
Refresh token is stored in an HTTP-only, Secure cookie in production
   │
   ▼
Protected API verifies the access token
   │
   └── Expired access token → refresh endpoint issues a replacement
```

---

## 🌐 Deployment

The backend runs on an Oracle Cloud Ubuntu VM using Node.js 22, PM2, Nginx, and MongoDB. The frontend is deployed on Vercel.

For production, configure HTTPS on the API and allow the Vercel origin in `CORS_ORIGIN`. An HTTPS frontend cannot call an HTTP API because browsers block mixed content.

---

## 🛣️ Future enhancements

- Key rotation and a controlled re-encryption workflow
- Managed key storage (KMS/HSM)
- Email verification and password reset delivery
- Document sharing and team workspaces
- Voice assistant and mobile application

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Anupam Rana**

- GitHub: https://github.com/anupamrana200
- LinkedIn: https://www.linkedin.com/in/anupam-rana-126143262/
- Email: anupamrana200@gmail.com
- call me: +91 7063631178

<p align="center">
Made with ❤️ using React, Node.js, Express, MongoDB, AI, and AES-256-GCM.
</p>
