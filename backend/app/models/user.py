from sqlalchemy import Column, Integer, String

from app.core.database import Base


class User(Base):
    __tablename__ = "usuario"

    id_usuario = Column(
        Integer,
        primary_key=True,
        index=True
    )

    login = Column(
        String(50),
        nullable=False,
        unique=True
    )

    senha = Column(
        String(255),
        nullable=False
    )

    perfil = Column(
        String(20),
        nullable=False
    )