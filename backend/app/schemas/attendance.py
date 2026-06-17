from pydantic import BaseModel


class AttendanceBase(BaseModel):
    id_aula: int
    id_matricula: int
    presente: bool


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    presente: bool | None = None


class AttendanceResponse(AttendanceBase):
    id_frequencia: int

    model_config = {
        "from_attributes": True
    }