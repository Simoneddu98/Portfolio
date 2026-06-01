from __future__ import annotations

from typing import Annotated, Literal, Optional, Union

from pydantic import BaseModel, EmailStr, Field, field_validator


class ConsulenzaAIForm(BaseModel):
    tipo: Literal["consulenza_ai"]
    nome: Annotated[str, Field(min_length=2, max_length=100)]
    email: EmailStr
    azienda: Annotated[str, Field(min_length=1, max_length=150)]
    descrizione: Annotated[str, Field(min_length=10, max_length=300)]


class FormazioneForm(BaseModel):
    tipo: Literal["formazione"]
    nome: Annotated[str, Field(min_length=2, max_length=100)]
    email: EmailStr
    team: Literal["individuale", "team_aziendale"]
    argomento: Annotated[str, Field(min_length=3, max_length=200)]


class AltroForm(BaseModel):
    tipo: Literal["altro"]
    nome: Annotated[str, Field(min_length=2, max_length=100)]
    email: EmailStr
    tipo_progetto: Annotated[str, Field(min_length=3, max_length=150)]
    budget: Optional[str] = None


FormData = Annotated[
    Union[ConsulenzaAIForm, FormazioneForm, AltroForm],
    Field(discriminator="tipo"),
]


def build_whatsapp_message(data: ConsulenzaAIForm | FormazioneForm | AltroForm) -> str:
    if data.tipo == "consulenza_ai":
        return (
            f"🤖 *Nuova richiesta: Consulenza AI*\n\n"
            f"👤 Nome: {data.nome}\n"
            f"📧 Email: {data.email}\n"
            f"🏢 Azienda/Progetto: {data.azienda}\n\n"
            f"📝 Descrizione:\n{data.descrizione}"
        )
    if data.tipo == "formazione":
        team_label = "Individuale" if data.team == "individuale" else "Team Aziendale"
        return (
            f"📚 *Nuova richiesta: Formazione*\n\n"
            f"👤 Nome: {data.nome}\n"
            f"📧 Email: {data.email}\n"
            f"👥 Tipo: {team_label}\n\n"
            f"🎯 Argomento:\n{data.argomento}"
        )
    # altro
    budget_line = f"\n💰 Budget: {data.budget}" if data.budget else ""
    return (
        f"🛒 *Nuova richiesta: Altro*\n\n"
        f"👤 Nome: {data.nome}\n"
        f"📧 Email: {data.email}\n"
        f"🔧 Progetto: {data.tipo_progetto}"
        f"{budget_line}"
    )
