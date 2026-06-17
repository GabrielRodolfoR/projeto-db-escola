from datetime import date
from pydantic import BaseModel


class EnrollmentBase(BaseModel):
    id_aluno: int
    id_turma: int
    data_matricula: date
    status: str


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseModel):
    status: str | None = None


class EnrollmentResponse(EnrollmentBase):
    id_matricula: int

    model_config = {
        "from_attributes": True
    }