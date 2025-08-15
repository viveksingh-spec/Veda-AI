# Veda Chatbot — Ultimate AI-Ready Roadmap

## Project Goal

Build a ChatGPT-like healthcare chatbot web app with:

- Responsive UI for desktop and mobile
- Support for image, voice, and text input
- Custom fine-tuned LLM integration
- Secure authentication (JWT + Google OAuth)
- Moderation and health disclaimer features
- Admin monitoring and metrics
- Full Dockerized local dev environment

## Tech Stack

- Frontend: React + JavaScript (Vite) + TailwindCSS
- Backend: FastAPI (async), Pydantic, MongoDB (Beanie or Motor)
- LLM: Custom fine-tuned model
- Auth: JWT + Google OAuth2
- Communication: REST + WebSocket streaming
- Containerization: Docker + docker-compose
- Testing: Jest + React Testing Library (frontend), pytest + httpx/pytest-asyncio (backend)

---

## 1️⃣ File & Folder Structure

```
veda/
├─ .env.example
├─ docker-compose.yml
├─ docker/
│  ├─ backend.Dockerfile
│  └─ frontend.Dockerfile
├─ README.md
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ tailwind.config.cjs
│  ├─ postcss.config.cjs
│  ├─ public/
│  │  └─ index.html
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ index.css
│     ├─ pages/
│     │  ├─ Login.jsx
│     │  ├─ Register.jsx
│     │  ├─ Home.jsx
│     │  └─ ChatPage.jsx
│     ├─ components/
│     │  ├─ Layout/
│     │  │  ├─ Topbar.jsx
│     │  │  └─ Sidebar.jsx
│     │  ├─ Chat/
│     │  │  ├─ ChatLayout.jsx
│     │  │  ├─ ConversationList.jsx
│     │  │  ├─ ChatWindow.jsx
│     │  │  ├─ MessageBubble.jsx
│     │  │  ├─ Composer.jsx
│     │  │  ├─ TypingIndicator.jsx
│     │  │  ├─ ImageUploader.jsx
│     │  │  └─ VoiceInput.jsx
│     │  └─ Common/
│     │     ├─ Button.jsx
│     │     ├─ Modal.jsx
│     │     └─ Icon.jsx
│     ├─ hooks/
│     │  ├─ useAuth.js
│     │  ├─ useWebSocket.js
│     │  └─ useDebounce.js
│     ├─ services/
│     │  ├─ api.js
│     │  └─ chatService.js
│     ├─ stores/
│     │  ├─ authStore.js
│     │  └─ uiStore.js
│     ├─ utils/
│     │  ├─ formatDate.js
│     │  └─ sanitizeHtml.js
│     ├─ assets/
│     └─ tests/
│        └─ ChatWindow.test.jsx
└─ backend/
   ├─ app/
   │  ├─ main.py
   │  ├─ core/
   │  │  ├─ config.py
   │  │  └─ security.py
   │  ├─ db/
   │  │  ├─ init_db.py
   │  │  └─ indexes.py
   │  ├─ models/
   │  │  ├─ user.py
   │  │  ├─ conversation.py
   │  │  └─ message.py
   │  ├─ schemas/
   │  │  ├─ auth.py
   │  │  └─ chat.py
   │  ├─ api/
   │  │  ├─ deps.py
   │  │  └─ routers/
   │  │     ├─ auth.py
   │  │     ├─ users.py
   │  │     ├─ conversations.py
   │  │     ├─ messages.py
   │  │     └─ stream.py
   │  ├─ services/
   │  │  ├─ llm_provider.py   # custom fine-tuned model integration
   │  │  └─ chat_manager.py
   │  └─ tests/
   │     └─ test_auth.py
   ├─ requirements.txt
   └─ Dockerfile

```

---

## 2️⃣ Milestones & Step-by-Step Tasks

### Milestone 1 — Scaffold Frontend & Backend

**Frontend**

- Create Vite React app:  
  `npm create vite@latest frontend --template react`
- Configure TailwindCSS: install + setup `tailwind.config.cjs` and `postcss.config.cjs`.
- Setup ESLint + Prettier.
- Create src/ folder structure as above

**Backend**

- Scaffold FastAPI app: `uvicorn app.main:app --reload`.
- Create `core/config.py` for environment variables.
- Create `core/security.py` for JWT logic.
- Setup MongoDB connection in `db/init_db.py`.
- Create Dockerfiles for frontend and backend.
- Create `docker-compose.yml` including MongoDB service.

---

### Milestone 2 — Authentication

- Implement JWT access + refresh tokens.
- Setup Google OAuth2 login.
- Create `/api/auth/register`, `/login`, `/refresh` endpoints.

**Frontend:**

- `Login.jsx` + `Register.jsx` pages
- Connect with backend API
- Store JWT in memory/localStorage
- Redirect to `ChatPage` after login

---

### Milestone 3 — MongoDB Models & CRUD

- **User:** email, hashed_password, name, role, refresh_tokens
- **Conversation:** user_id, title, messages_count, timestamps
- **Message:** conversation_id, sender, content, status, metadata
- Create Pydantic schemas for request/response validation.
- Create CRUD endpoints for conversations & messages
  **Indexes:**

- `Conversation.user_id`
- `Message.conversation_id`
- `User.email`

---

### Milestone 4 — Chat Page & Layout

- Responsive layout using flex/grid.

**Sidebar:**

- `ConversationList.jsx`
- New conversation button

**ChatWindow:**

- Message streaming
- Typing indicator

**Composer:**

- Text input
- Shift+Enter → newline
- Enter → send

**Components:**

- `ImageUploader.jsx`
- `VoiceInput.jsx`

---

### Milestone 5 — Messaging & Streaming

**Backend:**

- POST `/api/conversations/{id}/messages` → enqueue user message
- WebSocket `/ws/conversations/{id}?token=<JWT>`
- Stream LLM tokens:  
   { "type": "chunk", "messageId": "...", "data": "..." }
  { "type": "done", "message": { "id": "...", "content": "..." } }
  { "type": "error", "error": "..." }

**Frontend:**

- `useWebSocket` hook with reconnect/backoff
- Message queuing
- Persist partial assistant messages to MongoDB periodically

---

### Milestone 6 — Advanced Chat Features

- Image upload → backend processing.
- Voice input → transcription → send as user message.
- Health disclaimer appended to all assistant responses.
- Mobile + desktop responsive styling with gradient background.

---

### Milestone 7 — Moderation & Safety

- Keyword-based moderation for user input + LLM output.
- Emergency modal for severe symptoms.
- Admin endpoint logs flagged conversations.

---

### Milestone 8 — Admin & Observability

- `/api/admin/stats` endpoint (protected role):
- total users
- active users
- conversations/day
- token usage
- Structured JSON logs
- Optional `/metrics` endpoint

---

### Milestone 9 — Testing & CI

**Frontend:**

- Jest + React Testing Library (ChatWindow streaming, Composer)

**Backend:**

- pytest + httpx/pytest-asyncio (auth, WebSocket simulation)

- GitHub Actions for CI
- Add test badges in README

---

### Milestone 10 — Deployment & Documentation

- `docker-compose up` → local dev environment
- `.env.example` with all required variables

**README:**

- Run instructions
- Architecture overview
- API docs
- Example conversation seed data

---

## 3️⃣ UX & Healthcare Safety Defaults

- Footer in every assistant message:  
  "This information is for educational purposes only and is not a substitute for professional medical advice. If you are experiencing a medical emergency, contact local emergency services."
- Emergency modal triggers for critical keywords.
- Consistent mobile + desktop responsive UI.
- Accessible components (buttons, forms, modals) with ARIA attributes.
