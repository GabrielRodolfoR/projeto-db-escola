from pydantic import BaseModel


class SubjectBase(BaseModel):
    nome: str
    carga_horaria: int
    descricao: str


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    nome: str | None = None
    carga_horaria: int | None = None
    descricao: str | None = None


class SubjectResponse(SubjectBase):
    id_materia: int

    model_config = {
        "from_attributes": True
    }