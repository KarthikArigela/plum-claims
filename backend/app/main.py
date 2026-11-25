from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import settings
from app.db.session import check_database

app = FastAPI(title="Plum Claims API")

# Local CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class ClaimPreview(BaseModel):
    employee_id: str = Field(min_length=1)
    patient_name: str = Field(min_length=1)
    treatment_date: date

@app.post("/claims/preview")
def preview_claim(claim: ClaimPreview):
    return {
        "message": "Input accepted for preview",
        "claim": claim,
    }

@app.get("/")
def root():
    return {"message": "Plum Claims API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ready")
async def readiness():
    if not await check_database():
        raise HTTPException(status_code=503, detail="Database unavailable")

    return {"status": "ready"}
