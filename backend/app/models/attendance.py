from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Attendance(Base):
    __tablename__ = "frequencia"

    id_frequencia = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_aula = Column(
        Integer,
        ForeignKey("aula.id_aula"),
        nullable=False
    )

    id_matricula = Column(
        Integer,
        ForeignKey("matricula.id_matricula"),
        nullable=False
    )

    presente = Column(Boolean)

    lesson = relationship(
        "Lesson",
        back_populates="attendances"
    )

    enrollment = relationship(
        "Enrollment",
        back_populates="attendances"
    )