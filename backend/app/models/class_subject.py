from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class ClassSubject(Base):
    __tablename__ = "turma_materia"

    id_turma_materia = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_turma = Column(
        Integer,
        ForeignKey("turma.id_turma"),
        nullable=False
    )

    id_materia = Column(
        Integer,
        ForeignKey("materia.id_materia"),
        nullable=False
    )

    id_professor = Column(
        Integer,
        ForeignKey("professor.id_professor"),
        nullable=False
    )

    class_group = relationship(
        "ClassGroup",
        back_populates="class_subjects"
    )

    subject = relationship(
        "Subject",
        back_populates="class_subjects"
    )

    teacher = relationship(
        "Teacher",
        back_populates="class_subjects"
    )

    lessons = relationship(
        "Lesson",
        back_populates="class_subject"
    )