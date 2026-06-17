from datetime import date
from pydantic import BaseModel


class LessonBase(BaseModel):
    id_turma_materia: int
    data_aula: date
    conteudo: str


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    data_aula: date | None = None
    conteudo: str | None = None


class LessonResponse(LessonBase):
    id_aula: int

    model_config = {
        "from_attributes": True
    }