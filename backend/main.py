from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.webhook import router as webhook_router
from routes.config import router as config_router
from routes.auth import router as auth_router

app = FastAPI(
    title="Dragify AI Agent API",
    description="AI Agent for lead extraction and processing with JWT authentication",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app"  # Allow all Vercel domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router, prefix="/webhook", tags=["webhook"])
app.include_router(config_router, prefix="/config", tags=["configuration"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {
        "message": "Dragify AI Agent API",
        "version": "1.0.0",
        "endpoints": {
            "webhook": "/webhook",
            "configuration": "/config",
            "authentication": "/auth",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "dragify-ai-agent"}
