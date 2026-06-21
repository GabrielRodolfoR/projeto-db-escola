from datetime import date, datetime
from pydantic import BaseModel, EmailStr


class StudentBase(BaseModel):
    nome: str
    cpf: str
    data_nascimento: date
    email: EmailStr
    telefone: str


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    nome: str | None = None
    cpf: str | None = None
    data_nascimento: date | None = None
    email: EmailStr | None = None   
    telefone: str | None = None


class StudentResponse(StudentBase):
    id_aluno: int
    data_cadastro: datetime

    model_config = {
        "from_attributes": True
    }