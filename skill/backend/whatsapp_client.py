from __future__ import annotations

import os

import httpx
from dotenv import load_dotenv

load_dotenv()

GRAPH_API_VERSION = "v25.0"
BASE_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"


def _get_config() -> tuple[str, str, str]:
    token = os.environ["WHATSAPP_TOKEN"]
    phone_number_id = os.environ["WHATSAPP_PHONE_NUMBER_ID"]
    recipient = os.environ["WHATSAPP_RECIPIENT"]
    return token, phone_number_id, recipient


async def send_text_message(body: str) -> dict:
    token, phone_number_id, recipient = _get_config()

    payload = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "text",
        "text": {"body": body, "preview_url": False},
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            f"{BASE_URL}/{phone_number_id}/messages",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        if not response.is_success:
            raise httpx.HTTPStatusError(
                f"{response.status_code}: {response.text}",
                request=response.request,
                response=response,
            )
        return response.json()
