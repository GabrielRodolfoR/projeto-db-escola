from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship

from app.core.database import Base


class Teacher(Base):
    __tablename__ = "professor"

    id_professor = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    email = Column(String(100))
    especialidade = Column(String(100))
    salario = Column(Numeric(10, 2))

    class_subjects = relationship(
        "ClassSubject",
        back_populates="teacher"
    )