from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import FormData, build_whatsapp_message
from whatsapp_client import send_text_message

app = FastAPI(title="WhatsApp Skill API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/send")
async def send(data: FormData):
    message = build_whatsapp_message(data)
    try:
        result = await send_text_message(message)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"WhatsApp API error: {exc}") from exc
    return {"success": True, "message_id": result.get("messages", [{}])[0].get("id")}
