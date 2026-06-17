from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base


class Student(Base):
    __tablename__ = "aluno"

    id_aluno = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    data_nascimento = Column(Date)
    email = Column(String(100))
    telefone = Column(String(20))
    data_cadastro = Column(DateTime)

    enrollments = relationship(
        "Enrollment",
        back_populates="student"
    )