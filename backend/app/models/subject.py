from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Subject(Base):
    __tablename__ = "materia"

    id_materia = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    carga_horaria = Column(Integer)
    descricao = Column(Text)

    class_subjects = relationship(
        "ClassSubject",
        back_populates="subject"
    )

    grades = relationship(
        "Grade",
        back_populates="subject"
    )