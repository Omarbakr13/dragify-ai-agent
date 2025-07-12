# Dragify AI Agent - Engineering Assessment

## 🧠 Project Overview

A complete AI Agent Template that demonstrates the ability to:
- React to trigger events via webhook
- Use LLMs to extract structured data from unstructured messages
- Take action based on extracted data (save to CRM)
- Monitor outcomes in a dynamic dashboard
- **JWT Authentication** for secure API access

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React +      │◄──►│   (FastAPI +    │◄──►│   (JSON CRM)    │
│   TailwindCSS)  │    │   Groq LLM +    │    │                 │
└─────────────────┘    │   JWT Auth)     │    └─────────────────┘
                       └─────────────────┘
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Backend | FastAPI (Python) |
| Frontend | React + TailwindCSS |
| LLM | Groq API (Llama3-70b) |
| Authentication | JWT (JSON Web Tokens) |
| Database | JSON file (mock CRM) |
| Hosting | Vercel (frontend) 

## 🔐 Authentication

### **JWT Authentication System**
- **Secure API Access**: All webhook endpoints require JWT authentication
- **Role-based Access**: Admin and user roles with different permissions
- **Token Expiration**: 30-minute token validity
- **Mock Users**: Pre-configured users for testing

### **Default Users**
| Username | Password | Role | Email |
|----------|----------|------|-------|
| `admin` | `admin123` | Admin | admin@dragify.com |
| `user1` | `user123` | User | user1@dragify.com |

### **Authentication Flow**
1. **Login**: `POST /auth/login` to get JWT token
2. **Use Token**: Include `Authorization: Bearer <token>` in requests
3. **Token Verification**: `POST /auth/verify` to validate tokens

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env file with your actual API key and JWT secret
   # Get your Groq API key from: https://console.groq.com/
   nano .env  # or use your preferred editor
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication
**POST** `/auth/login`
Login to get JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "username": "admin",
  "role": "admin"
}
```

**GET** `/auth/me`
Get current user information (requires authentication).

**POST** `/auth/verify`
Verify if token is valid (requires authentication).

### Webhook Trigger (Requires Authentication)
**POST** `/webhook/`

Triggers the AI agent to process a message and extract lead information.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "message": "Hi there, I'm Ahmed Bassyouni from Cloudilic. You can reach me at ahmed@cloudilic.com"
}
```

**Response:**
```json
{
  "extracted": {
    "name": "Ahmed Bassyouni",
    "email": "ahmed@cloudilic.com",
    "company": "Cloudilic"
  },
  "save_status": "success",
  "authenticated_user": "admin"
}
```

### Get Logs (Requires Authentication)
**GET** `/webhook/logs`

Retrieves all processed webhook logs for dashboard display.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
[
  {
    "id": "1",
    "timestamp": "2024-01-15T10:30:00",
    "message": "Original message...",
    "extracted": {
      "name": "omar",
      "email": "omar@example.com",
      "company": "Example Corp"
    },
    "save_status": "success"
  }
]
```

## 🤖 Agent Logic

### Message Processing Flow
1. **Authentication** → Validate JWT token
2. **Webhook Trigger** → Receives unstructured message
3. **LLM Processing** → Uses Groq API to extract structured data
4. **Data Validation** → Ensures required fields are present
5. **CRM Save** → Stores lead data to mock CRM
6. **Logging** → Records the entire process for monitoring

### LLM Prompt
```
Extract the full name, email, and company name from the following message:
"[MESSAGE]"

Return ONLY valid JSON in this exact format without any additional text:
{ "name": "...", "email": "...", "company": "..." }
```

## 📊 Dashboard Features

### Real-time Monitoring
- **Trigger Event Log** - Shows all webhook calls with timestamps
- **Lead Data Display** - Extracted information in card format
- **CRM Status** - Success/failure indicators
- **Analytics Chart** - Leads per hour/day visualization
- **Statistics Cards** - Total leads, success rate, today's leads

### Key Metrics
- Total leads processed
- Success rate percentage
- Daily lead count
- Real-time processing status

## 🔧 Configuration

### Environment Variables

**Local Development:**
```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit with your actual API key and JWT secret
GROQ_API_KEY=your_actual_groq_api_key_here
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

**Production Deployment:**
- **Frontend**: Deploy to Vercel (backend runs locally)
- **Backend**: Run locally with `uvicorn main:app --reload`

**⚠️ Security Note:** Never commit `.env` files to version control!

### Customization Options
- **LLM Model**: Change in `services/agent.py` (currently Llama3-70b)
- **CRM Storage**: Modify `database/mock_crm.py` for different storage
- **Dashboard**: Customize components in `frontend/src/components/`
- **Authentication**: Modify `services/auth.py` for custom user management

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Authentication Tests
```bash
cd backend
python -m pytest tests/test_auth.py -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push

### Backend (Local Development Only)
The backend is designed to run locally for this assessment. To run the complete system:

1. **Start Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
dragify-ai-agent/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt     # Python dependencies
│   ├── routes/
│   │   ├── webhook.py       # Webhook endpoints (authenticated)
│   │   ├── config.py        # Configuration endpoints
│   │   └── auth.py          # Authentication endpoints
│   ├── services/
│   │   ├── agent.py         # LLM processing logic
│   │   ├── auth.py          # JWT authentication service
│   │   ├── user_manager.py  # User session management
│   │   └── config_manager.py # Dynamic configuration
│   ├── models/
│   │   ├── lead.py          # Pydantic models
│   │   └── auth.py          # Authentication models
│   ├── database/
│   │   └── mock_crm.py      # CRM storage logic
│   └── tests/
│       ├── test_agent.py    # Agent service tests
│       ├── test_crm.py      # CRM storage tests
│       ├── test_webhook.py  # Webhook endpoint tests
│       └── test_auth.py     # Authentication tests
```

## 🔐 Security Features

### **JWT Authentication**
- **Token-based**: Secure stateless authentication
- **Role-based Access**: Admin and user permissions
- **Token Expiration**: Automatic token invalidation
- **Password Hashing**: bcrypt password security

### **Access Control**
- **Admin Role**: Full access to all endpoints and user data
- **User Role**: Access only to own data and basic endpoints
- **Session Management**: Automatic session cleanup
- **Rate Limiting**: Configurable request limits

### **Production Considerations**
- **Environment Variables**: Secure configuration management
- **HTTPS**: Required for production deployment
- **Token Rotation**: Implement for enhanced security
- **Database**: Replace mock storage with secure database