# Dragify AI Agent – Engineering Assessment

## 🧠 Project Overview
A full-stack AI Agent Automation Platform that:
- Reacts to trigger events (webhook)
- Uses LLMs to extract structured data from unstructured messages
- Takes action (saves to CRM with retry logic)
- Monitors outcomes in a dynamic dashboard
- Supports multi-user (admin/user) with JWT authentication
- Allows dynamic business logic/config updates

---

## 🏗️ Architecture
```
Frontend (React + TailwindCSS)  <->  Backend (FastAPI + JWT + LLM)  <->  Mock CRM (JSON)
```
- **Frontend:** React, TailwindCSS, Vercel deployment
- **Backend:** FastAPI (Python), JWT Auth, LLM (Groq API), Render deployment
- **Storage:** JSON file as mock CRM

---

## ⚙️ Tech Stack
| Category         | Technology                |
|------------------|--------------------------|
| Backend Lang     | Python                   |
| Backend          | FastAPI                  |
| Agent Logic      | Groq API (Llama3-70b)    |
| Auth             | JWT (JSON Web Tokens)    |
| Frontend         | React + TailwindCSS      |
| Database         | JSON file (mock CRM)     |
| Hosting          | Render (backend), Vercel (frontend) |

---

## 🚀 Quick Start
### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API key

### Backend Setup (Render)
1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Environment variables:**
   - Copy `env.example` to `.env` and fill in:
     - `GROQ_API_KEY=your_groq_api_key`
     - `JWT_SECRET_KEY=your_jwt_secret`
3. **Run locally:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```


### Frontend Setup (Vercel)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run locally:**
   ```bash
   npm start
   # Open http://localhost:3000
   ```


---

## 🔐 Authentication (JWT)
- **JWT tokens** for all protected endpoints
- **Admin/User roles**
- **Token expiration:** 30 minutes
- **Mock users** for demo/testing

### Default Users
| Username | Password   | Role  | Email              |
|----------|------------|-------|--------------------|
| admin    | admin123   | admin | admin@dragify.com  |
| user     | user123    | user  | user@dragify.com   |

### Auth Flow
1. **Login:** `POST /auth/login` (get JWT)
2. **Use Token:** `Authorization: Bearer <token>`
3. **Verify:** `POST /auth/verify`

---

## 📡 API Endpoints
### Auth
- `POST /auth/login` – Login, get JWT
- `POST /auth/register` – Register new user
- `GET /auth/me` – Get current user info
- `POST /auth/verify` – Verify token
- `PUT /auth/users/{user_id}/toggle` – Toggle user active status (admin)
- `GET /auth/users` – List users (admin)

### Webhook
- `POST /webhook/` – Trigger agent (extract lead from message)
- `GET /webhook/logs` – Get event logs (admin/user)
- `GET /webhook/crm-stats` – CRM stats
- `POST /webhook/session` – Create session
- `GET /webhook/users/{user_id}/stats` – User stats
- `GET /webhook/users/stats` – All users stats (admin)
- `GET /webhook/sessions/cleanup` – Cleanup expired sessions (admin)

### Config (Dynamic Business Logic)
- `GET /config/` – Get config
- `PUT /config/` – Update config
- `PUT /config/llm` – Update LLM settings
- `PUT /config/crm` – Update CRM settings
- `PUT /config/webhook` – Update webhook settings
- `POST /config/reset` – Reset config to defaults
- `GET /config/history` – Config change history
- `GET /config/validate` – Validate config

---

## 🤖 Agent Logic & Features
- **LLM Extraction:** Uses Groq API (Llama3-70b) to extract name, email, company from unstructured messages
- **Retry Logic:** CRM save has up to 3 retries on failure
- **Multi-User/Session:** User/session IDs tracked, logs per user
- **Dynamic Config:** Update LLM, CRM, webhook settings at runtime
- **Admin/User Management:** Admin can view/toggle users, see stats
- **Logging:** All events, actions, and errors are logged

---

## 📊 Dashboard Features
- **Trigger Event Log:** Type, timestamp, message, extracted data, CRM status
- **Lead Cards:** Show extracted lead info
- **Chart:** Leads per hour/day (last 24h)
- **Stats Cards:** Total leads, success rate, today’s leads, etc.
- **Admin Panel:** User management, analytics, settings
- **Responsive UI:** Modern, clean, and mobile-friendly

---

## 🧪 Testing
- **Backend:**
  - Run: `pytest` in `backend/`
  - Tests: `backend/tests/test_agent.py`, `test_crm.py`, `test_webhook.py`
`

---


## 📂 Project Structure (Key Files)
```
backend/
  main.py                # FastAPI app
  routes/                # API endpoints (webhook, auth, config)
  services/              # Agent, config, user, auth logic
  database/              # Mock CRM (crm.json)
  models/                # Pydantic models
  tests/                 # Unit/mock tests
frontend/
  src/
    pages/               # Dashboard, login, admin pages
    components/          # Dashboard widgets, UI
    services/            # API/auth/webhook/user services
    viewmodels/          # React hooks for state/data
    styles/              # Tailwind/custom CSS
```

---

## 🛠️ Environment Variables
- **Backend:**
  - `GROQ_API_KEY` – Your Groq LLM API key
  - `JWT_SECRET_KEY` – Secret for JWT tokens
- **Frontend:**
  - `REACT_APP_API_URL` – Backend API URL (Render)

---





> **Note:** The demo video is included in the `backend/` directory as `dragify assessment.mp4`

---

## 🌐 Deployment Links
- **Frontend (Vercel):** [https://dragify-ai-agent.vercel.app]

---

## 👨‍💻 Author 
- **Author:** [Omar Bakr]
