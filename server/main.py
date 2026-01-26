from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router, session_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="FormAi API",
    description="Backend for FormAi AI Sports Coach",
    version="0.1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(session_router.router)

@app.get("/")
def health_check():
    return {"status": "active", "system": "FormAi Brain"}
