from sqlalchemy import Column, Integer, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Lesson(Base):
    __tablename__ = "aula"

    id_aula = Column(Integer, primary_key=True, index=True)

    id_turma_materia = Column(
        Integer,
        ForeignKey("turma_materia.id_turma_materia"),
        nullable=False
    )

    data_aula = Column(Date)
    conteudo = Column(Text)

    class_subject = relationship(
        "ClassSubject",
        back_populates="lessons"
    )

    attendances = relationship(
        "Attendance",
        back_populates="lesson"
    )