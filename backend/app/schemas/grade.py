from decimal import Decimal
from pydantic import BaseModel


class GradeBase(BaseModel):
    id_matricula: int
    id_materia: int
    nota: Decimal


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    nota: Decimal | None = None


class GradeResponse(GradeBase):
    id_nota: int

    model_config = {
        "from_attributes": True
    }