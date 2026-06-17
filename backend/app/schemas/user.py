from pydantic import BaseModel


class UserBase(BaseModel):
    login: str
    perfil: str


class UserCreate(UserBase):
    senha: str


class UserUpdate(BaseModel):
    login: str | None = None
    senha: str | None = None
    perfil: str | None = None


class UserResponse(UserBase):
    id_usuario: int

    model_config = {
        "from_attributes": True
    }