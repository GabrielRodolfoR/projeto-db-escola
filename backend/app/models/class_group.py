from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class ClassGroup(Base):
    __tablename__ = "turma"

    id_turma = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False)
    ano = Column(Integer)
    semestre = Column(Integer)
    turno = Column(String(20))

    enrollments = relationship(
        "Enrollment",
        back_populates="class_group"
    )

    class_subjects = relationship(
        "ClassSubject",
        back_populates="class_group"
    )