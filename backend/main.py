from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.webhook import router as webhook_router
from routes.config import router as config_router

app = FastAPI(
    title="Dragify AI Agent API",
    description="AI Agent for lead extraction and processing",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(webhook_router, prefix="/webhook", tags=["webhook"])
app.include_router(config_router, prefix="/config", tags=["configuration"])

@app.get("/")
async def root():
    return {
        "message": "Dragify AI Agent API",
        "version": "1.0.0",
        "endpoints": {
            "webhook": "/webhook",
            "configuration": "/config",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "dragify-ai-agent"}
