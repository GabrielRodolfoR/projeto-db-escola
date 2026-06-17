from decimal import Decimal
from pydantic import BaseModel, EmailStr


class TeacherBase(BaseModel):
    nome: str
    cpf: str
    email: EmailStr
    especialidade: str
    salario: Decimal


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    nome: str | None = None
    cpf: str | None = None
    email: EmailStr | None = None
    especialidade: str | None = None
    salario: Decimal | None = None


class TeacherResponse(TeacherBase):
    id_professor: int

    model_config = {
        "from_attributes": True
    }