from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Enrollment(Base):
    __tablename__ = "matricula"

    id_matricula = Column(Integer, primary_key=True, index=True)

    id_aluno = Column(
        Integer,
        ForeignKey("aluno.id_aluno"),
        nullable=False
    )

    id_turma = Column(
        Integer,
        ForeignKey("turma.id_turma"),
        nullable=False
    )

    data_matricula = Column(Date)
    status = Column(String(20))

    student = relationship(
        "Student",
        back_populates="enrollments"
    )

    class_group = relationship(
        "ClassGroup",
        back_populates="enrollments"
    )

    grades = relationship(
        "Grade",
        back_populates="enrollment"
    )

    attendances = relationship(
        "Attendance",
        back_populates="enrollment"
    )