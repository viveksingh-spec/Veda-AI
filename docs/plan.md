# Veda Chatbot — Execution Plan

**Purpose:** Turn the roadmap into a concrete, sequenced plan with unambiguous steps, commands, and acceptance criteria.
**Rules:** JS React frontend (Vite), FastAPI backend, MongoDB (Beanie/Motor), TailwindCSS, JWT + Google OAuth2, REST + WebSocket streaming, Dockerized local dev, no OpenAI API.

---

## Scope and assumptions

- **Frontend:** React (Vite) + JavaScript only, TailwindCSS, Jest + React Testing Library
- **Backend:** FastAPI (async), Pydantic, MongoDB via Beanie ODM (on top of Motor)
- **Auth:** JWT access + refresh, Google OAuth2
- **Communication:** REST for CRUD, WebSocket for streaming
- **LLM:** Custom fine‑tuned local/service model integrated via `llm_provider.py` abstraction
- **Containers:** Docker + docker-compose
- **OS:** Windows 10/11 dev experience friendly, PowerShell commands shown
- **Docs:** `docs/roadmap.md`, `docs/plan.md`
- **Frontend-first:** Build full UI with mocks → then backend → integrate → harden.

---

## 1.Environments

### 1.1 Local (docker-compose)

- **Services:** `frontend` (5173), `backend` (8000), `mongodb` (27017)
- Volumes for MongoDB data persistence
- Hot reload for frontend/backend

### 1.2 Environment variables (.env.example)

**Backend:**

```
MONGODB_URI=mongodb://mongodb:27017/veda
JWT_SECRET=replace_me
JWT_ALG=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
GOOGLE_CLIENT_ID=replace_me
GOOGLE_CLIENT_SECRET=replace_me
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5173/oauth/callback
LLM_PROVIDER=local
LLM_ENDPOINT=http://llm:8080
ENABLE_MODERATION=true
ENABLE_METRICS=false
```

**Frontend:**

```
VITE_API_BASE=http://localhost:8000
VITE_WS_BASE=ws://localhost:8000
VITE_GOOGLE_CLIENT_ID=replace_me
```

## 2. Directory Guardrails (target structure)

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
│  │  └─ vite.svg
|  ├─ index.html
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

## 3. Phased plan (Strict Sequence)

### Phase F — Frontend First (UI + mocks)

#### F00 — Repo setup and quality gates (frontend)

**Actions**

- Initialize git repo structure
- Add `docs/` with `roadmap.md` and `plan.md`
- Prettier + ESLint configuration (JS only)
- Add `.editorconfig`
- Create `.env.example`
- Define npm scripts for lint/test

**Commands(PowerShell)**

```powershell
cd .\veda
git init
echo "root = true`n[*]`nindent_style = space`nindent_size = 2" > .editorconfig
```

**Acceptance**

- Running `npm run lint` in `frontend/` passes (baseline)

#### F01 — Vite App + Tailwind + Router + Axios

**Actions**

- Create app (if not already): vite react
- Install deps: tailwind, postcss, autoprefixer, react-router-dom, axios
- Init Tailwind and wire index.css

**Commands(PowerShell)**

```powershell
cd .\veda
npm create vite@latest frontend -- --template react
cd .\frontend
npm i tailwindcss postcss autoprefixer react-router-dom axios
npx tailwindcss init -p
npm i -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

**Acceptance**

- App boots at http://localhost:5173, Tailwind classes render.

#### F02 — Frontend Structure & Routing

**Actions**

- Create all folders & empty files inside frontend/src/: (see Directory Guardrails)
- Setup BrowserRouter in main.jsx
- Define routes in App.jsx: /login, /register, /chat (Home can redirect to /chat)

**Acceptance**

- Navigating routes switches pages (basic placeholders visible).

#### F03 — Core Layout (Topbar, Sidebar, Chat Scaffolding)

**Actions**

- Implement responsive shell in `ChatPage.jsx` using `ChatLayout.jsx`
- Add `Topbar.jsx`, `Sidebar.jsx` with placeholders
- Keyboard handling outline in `Composer.jsx` (Enter send, Shift+Enter newline)

**Acceptance**

- Mobile/desktop responsive splits; no console errors.

#### F04 — Auth UI + Store (Mock)

**Actions**

- Build `Login.jsx`, `Register.jsx` forms (email, password, name)
- Add `authStore.js` (in-memory accessToken; refreshToken in localStorage mock only)
- Add `useAuth.js` (helpers: login, logout, register, isAuthed)
- Add placeholder Google button (reads `VITE_GOOGLE_CLIENT_ID`)
- Route guards; redirect to `ChatPage` after login

**Acceptance**

- “Login” sets mock auth state and redirects to /chat.

#### F05 — Chat UI Components + Mock Data

**Actions**

- Responsive layout with sidebar and chat window
- Components: `ConversationList`, `ChatWindow`, `MessageBubble`, `Composer`, `TypingIndicator`, `ImageUploader`, `VoiceInput`
- Keyboard handling (Enter=send, Shift+Enter=newline)
- Light gradient background; mobile and desktop views
- Create services/mockApi.js to simulate:
  - listConversations(), createConversation(), deleteConversation()
  - listMessages(conversationId), createMessage()
- Wire UI to mockApi via chatService.js (toggle with VITE_USE_MOCK_API)

**Acceptance**

- Switching conversations updates the chat window
- Selecting conversations renders messages; sending message appends mock reply (delayed).

#### F06 — WebSocket Hook (Mock)

**Actions**

- Implement useWebSocket.js with interface:
  connect(token, conversationId), onChunk(cb), onDone(cb), onError(cb), disconnect()
- Add mock implementation that emits chunks from a static string to drive UI
- In ChatWindow, render streamed partials, then finalize message

**Acceptance**

- Live token streaming visible in UI; partial → final message transition works
- WebSocket reconnect resumes safely without duplicating messages

#### F07 — UX Polish + Accessibility + Disclaimer

**Actions**

- Gradient background, focus states, ARIA labels on buttons/inputs
- Append static healthcare disclaimer to assistant bubbles in UI
- Collapsible sidebar on mobile

**Acceptance**

- Keyboard navigable; disclaimer consistently visible on assistant messages.

#### F08 — Utilities, Stores, Services Hardening

**Actions**

- uiStore.js: sidebar state, active conversation, modals
- utils/formatDate.js, utils/sanitizeHtml.js (basic)
- services/api.js: Axios instance (reads VITE_API_BASE), auth header injection (from store)

**Acceptance**

- No errors; all modules imported where needed; mocks still active.

#### F09 — Frontend Tests

**Actions**

- Add Jest + RTL; write tests for:
- ChatWindow rendering stream partials → final
- Composer submit behaviors
- Conversation switching renders correct messages

**Commands(PowerShell)**

```powershell
cd .\frontend
npm i -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-jest
```

**Acceptance**

- npm test passes locally.

---

**FrontEnd Done Criteria**

- Routing solid (/login, /register, /chat)
- Full chat UI working with mock REST + mock WebSocket
- Disclaimer shown on assistant messages
- Basic tests green

---

### Phase B — Backend (APIs, Auth, Models, Streaming)

#### B00 — Backend Scaffold + Health

**Actions**

- Create backend/ with FastAPI layout (`app/` tree as in guardrails(target structure))
- App factory in `app/main.py`
- Add `/health` endpoint
- Add requirements.txt (fastapi, uvicorn, pydantic, beanie, motor, bcrypt, python-jose[cryptography], python-multipart, httpx)

**Acceptance**

- `uvicorn app.main:app --reload` serves /health 200.

#### B01 — Config, Security, DB

**Actions**

- Config module `core/config.py`: load envs, CORS origins
- Security module `core/security.py`: password hash/verify (bcrypt), JWT create/verify, token payloads
- `db/init_db.py`: connect Beanie to Mongo; `db/indexes.py`: ensure indexes on startup

**Acceptance**

- Startup logs show Mongo connected; no index errors.

#### B02 — Models & Schemas

**Actions**

- Beanie Documents: - User: `email`, `hashed_password`, `name`, `role`, `refresh_tokens`, timestamps - Conversation: `user_id`, `title`, `messages_count`, timestamps - Message: `conversation_id`, `sender` ("user"|"assistant"), `content`, `status`, `metadata`, timestamps
- Pydantic schemas: schemas/auth.py, schemas/chat.py
- Timestamps on documents; sender enum (“user”|“assistant”)

**Acceptance**

- Unit create/list works via a temporary dev script or Python shell.

#### B03 — Auth Endpoints (Email/Password + Google OAuth2)

**Actions**

- REST: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`
- Google OAuth: `/api/auth/google/login` (redirect URL), `/api/auth/google/callback`
- Issue access (short) + refresh (long) tokens
- CORS configured for http://localhost:5173

**Acceptance**

- Register/login/refresh round-trip; /me authorized with Bearer token.
- Google flow completes locally (or feature-flag if creds not yet ready).
- Google OAuth provides a session and redirects to `ChatPage`
- Register/login/refresh flows work end‑to‑end against MongoDB
- `Authorization: Bearer <access>` applied to protected API calls; auto‑refresh on 401

#### B04 — Conversations & Messages CRUD

**Actions**

- /api/conversations GET/POST
- /api/conversations/{id} GET/DELETE
- /api/conversations/{id}/messages GET/POST
- CRUD endpoints: conversations list/create/delete, messages list/create
- Indexes: User.email, Conversation.user_id, Message.conversation_id

**Acceptance**

- CRUD returns validated schemas; indexes created on startup without error.

#### B05 — Streaming (WebSocket)

**Actions**

- ws://.../ws/conversations/{id}?token=<JWT> authenticates, streams chunks
- Stream Protocol:
  ```json
  { "type": "chunk", "messageId": "...", "data": "..." }
  { "type": "done", "message": { "id": "...", "content": "..." } }
  { "type": "error", "error": "..." }
  ```
- services/llm_provider.py: start with echo/markov dev mode
- services/chat_manager.py: enqueue user msg, stream assistant, persist partials, finalize
- Append server-side health disclaimer to assistant messages

**Acceptance**

- Test client receives chunked tokens → final; DB contains full thread.

#### B06 — Moderation & Safety

**Actions**

- Simple keyword moderation on input/output; configurable via ENABLE_MODERATION
- Emergency keywords trigger flag in message metadata and in UI for critical keywords
- Admin log for flagged events (to console or collection)

**Acceptance**

- Blocked content returns safe message; flags recorded
- Admin logs show flagged items

#### B07 — Admin & Observability

**Actions**

- /api/admin/stats (role protected): totals, daily conversations, token counts
- Structured JSON logs
- Optional /metrics (feature-flagged) for Prometheus

**Acceptance**

- Admin Stats reflect seed data; logs are structured and searchable.

#### B08 — Backend Tests

**Actions**

- pytest + httpx/pytest-asyncio for auth, CRUD, WebSocket simulation

**Acceptance**

- pytest green locally.

### Phase I — Integration & Advanced Features

#### I00 — Wire Frontend to Real API

**Actions**

- Set VITE_USE_MOCK_API=false
- services/api.js: Axios baseURL = VITE_API_BASE, interceptors add access token & handle 401 with refresh
- chatService.js: point to real endpoints

**Acceptance**

- Login/Register/Refresh works against backend; /chat loads real conversations/messages.

#### I01 — Real Streaming

**Actions**

- useWebSocket.js: connect to VITE_WS_BASE/ws/conversations/{id}?token=<JWT>
- Replace mock stream with server stream; keep reconnect/backoff

**Acceptance**

- Live token streaming visible; partial → final transition correct; reconnect idempotent.

#### I02 — Image Upload & Voice Input

**Actions**

- Image: ImageUploader → backend upload endpoint; store metadata; render as message
- Voice: capture audio (Web Speech API or MediaRecorder), send for transcription (backend optional service: faster-whisper), append text message
- Ensure disclaimer footer appears on all assistant messages

**Acceptance**

- Image messages persist; voice → text → message displayed.
- Voice capture converts to text and sends as a user message

#### I03 — Moderation UI & Emergency Modal

**Actions**

- When backend flags severe symptoms, show modal with emergency resources
- Blocked content feedback in Composer

**Acceptance**

- Triggering keywords displays modal; UX remains non-blocking.

### Phase D — Docker, CI, Docs

#### D00 — Dockerfiles & Compose

**Actions**

- docker/frontend.Dockerfile (Node 20, npm run dev -- --host)
- docker/backend.Dockerfile (Python 3.11, uvicorn reload)
- docker-compose.yml for frontend, backend, mongodb (+ volume)

**Commands(PowerShell)**

```powershell
cd .\veda
copy .env.example .env
docker-compose up --build
```

**Acceptance**

- Visiting http://localhost:5173 → login → chat with streaming works end-to-end.

#### D01 — README & Dev Onboarding

**Actions**

- Expand `.env.example`
- Add README with run instructions, architecture diagram, API endpoints summary, seed data notes

**Acceptance**

- A new dev can clone → `docker-compose up` → use app in <10 minutes.

#### D02 — CI (GitHub Actions)

**Actions**

- Frontend: install → lint → test
- Backend: install → pytest
- Cache node/pip

**Acceptance**

- CI green on PR; min coverage threshold (e.g., 70%).

## 4. API Contracts (freeze before backend work)

**Auth**

- POST /api/auth/register → {email, password, name} → 201 user
- POST /api/auth/login → {email, password} → {access, refresh}
- POST /api/auth/refresh → {refresh} → {access}
- GET /api/auth/me → header Bearer → user
- Google: /api/auth/google/login (redirect), /api/auth/google/callback

**Conversations**

- GET /api/conversations → list
- POST /api/conversations → {title?} → {id}
- GET /api/conversations/{id} → conversation
- DELETE /api/conversations/{id} → 204

**Messages**

- GET /api/conversations/{id}/messages → list
- POST /api/conversations/{id}/messages → {content, type=text|image|voice, metadata?} → {id}

**Stream**

- GET ws:/ws/conversations/{id}?token=<JWT>
- Events: chunk | done | error (see payloads above)

---

## Keep these in docs/api-contract.md and import shapes in frontend/src/services/contracts.js (JS objects) to align UI and server.

## 5. Security & Safety

- Store access token in memory;store refresh token in localStorage (or secure cookie if later adopted)
- Strict CORS: allow only http://localhost:5173 in dev
- Validate uploads (size/type) for images; sanitize any rendered HTML
- Server appends disclaimer to assistant messages

## 6. Developer Runbook

### One-time

**Commands(PowerShell)**

```powershell
cd .\veda
copy .env.example .env
```

### Local (without Docker)

**Commands(PowerShell)**

```powershell
# Backend
cd .\backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd .\frontend
npm install
npm run dev
```

### Local (with Docker)

**Commands(PowerShell)**

```powershell
cd .\veda
docker-compose up --build
```

## 7. Risks & Mitigations

- Google OAuth setup complexity → document console steps, provide fallback email/password flow
- WebSocket auth and reconnect edge cases → implement exponential backoff and idempotent message persistence
- Streaming backpressure → throttle, batch partial DB writes
- Large image/voice payloads → enforce limits; offload heavy work
- Index performance → ensure indexes on startup; monitor slow queries

## 8. Definition of Done (per feature)

- Code + tests + docs updated
- Lint passes; unit tests green; CI green
- Manual acceptance meets criteria in this plan

## 9. Deliverables Checklist

- [ ] Frontend UI complete with mocks (REST + WS)
- [ ] Backend auth (JWT + Google) end‑to‑end
- [ ] CRUD for conversations/messages
- [ ] Streaming chat with disclaimer
- [ ] Integration (real API + WS)
- [ ] Image upload + voice input
- [ ] Moderation + emergency modal
- [ ] Admin stats + logs
- [ ] Dockerized dev environment with frontend/backend/MongoDB
- [ ] Tests (FE+BE) + CI
- [ ] README + .env.example + API contracts

## 10. Timeline (rough)

- Weeks 1–2: Phase F (F00–F09) + B00–B05 core
- Week 3: B06–B08, Integration (I00–I03), Docker/CI/Docs (D00–D02)
