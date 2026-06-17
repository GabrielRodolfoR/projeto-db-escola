from pydantic import BaseModel


class ClassSubjectBase(BaseModel):
    id_turma: int
    id_materia: int
    id_professor: int


class ClassSubjectCreate(ClassSubjectBase):
    pass


class ClassSubjectUpdate(BaseModel):
    id_turma: int | None = None
    id_materia: int | None = None
    id_professor: int | None = None


class ClassSubjectResponse(ClassSubjectBase):
    id_turma_materia: int

    model_config = {
        "from_attributes": True
    }