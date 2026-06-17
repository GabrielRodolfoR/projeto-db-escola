from pydantic import BaseModel


class ClassGroupBase(BaseModel):
    nome: str
    ano: int
    semestre: int
    turno: str


class ClassGroupCreate(ClassGroupBase):
    pass


class ClassGroupUpdate(BaseModel):
    nome: str | None = None
    ano: int | None = None
    semestre: int | None = None
    turno: str | None = None


class ClassGroupResponse(ClassGroupBase):
    id_turma: int

    model_config = {
        "from_attributes": True
    }