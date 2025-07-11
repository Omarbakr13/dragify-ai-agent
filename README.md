# Dragify AI Agent - Engineering Assessment

## 🧠 Project Overview

A complete AI Agent Template that demonstrates the ability to:
- React to trigger events via webhook
- Use LLMs to extract structured data from unstructured messages
- Take action based on extracted data (save to CRM)
- Monitor outcomes in a dynamic dashboard

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React +      │◄──►│   (FastAPI +    │◄──►│   (JSON CRM)    │
│   TailwindCSS)  │    │   Groq LLM)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Backend | FastAPI (Python) |
| Frontend | React + TailwindCSS |
| LLM | Groq API (Llama3-70b) |
| Database | JSON file (mock CRM) |
| Hosting | Vercel (frontend) 

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
   # Create .env file
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
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

### Webhook Trigger
**POST** `/webhook/`

Triggers the AI agent to process a message and extract lead information.

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
  "save_status": "success"
}
```

### Get Logs
**GET** `/webhook/logs`

Retrieves all processed webhook logs for dashboard display.

**Response:**
```json
[
  {
    "id": "1",
    "timestamp": "2024-01-15T10:30:00",
    "message": "Original message...",
    "extracted": {
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Example Corp"
    },
    "save_status": "success"
  }
]
```

## 🤖 Agent Logic

### Message Processing Flow
1. **Webhook Trigger** → Receives unstructured message
2. **LLM Processing** → Uses Groq API to extract structured data
3. **Data Validation** → Ensures required fields are present
4. **CRM Save** → Stores lead data to mock CRM
5. **Logging** → Records the entire process for monitoring

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
```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Customization Options
- **LLM Model**: Change in `services/agent.py` (currently Llama3-70b)
- **CRM Storage**: Modify `database/mock_crm.py` for different storage
- **Dashboard**: Customize components in `frontend/src/components/`

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
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

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

## 📁 Project Structure

```
dragify-ai-agent/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt     # Python dependencies
│   ├── routes/
│   │   └── webhook.py       # Webhook endpoints
│   ├── services/
│   │   └── agent.py         # LLM processing logic
│   ├── models/
│   │   └── lead.py          # Pydantic models
│   └── database/
│       ├── mock_crm.py      # CRM storage logic
│       └── crm.json         # Mock CRM data
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── components/
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   ├── Chart.js     # Analytics chart
│   │   │   ├── LeadCard.js  # Lead display cards
│   │   │   └── TriggerLog.js # Event logs
│   │   └── index.css        # TailwindCSS imports
│   ├── package.json         # Node.js dependencies
│   └── tailwind.config.js   # TailwindCSS configuration
└── README.md                # This file
```

## 🔒 Security Considerations

- API keys stored in environment variables
- CORS configured for frontend-backend communication
- Input validation using Pydantic models
- Error handling without exposing sensitive data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8000
   - Check CORS configuration in `main.py`

2. **LLM API Errors**
   - Verify GROQ_API_KEY is set correctly
   - Check API quota and limits

3. **Frontend Not Loading**
   - Ensure backend is running
   - Check browser console for errors

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check server logs for detailed error messages

## 📄 License

This project is created for the Dragify Engineering Assessment.

---

**Demo Video**: [Loom Walkthrough](https://loom.com/share/...) *(to be added)*
**Live Demo**: [Frontend Deployment](https://...) *(to be added)*