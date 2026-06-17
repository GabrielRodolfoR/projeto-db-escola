from sqlalchemy import Column, Integer, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Grade(Base):
    __tablename__ = "nota"

    id_nota = Column(Integer, primary_key=True, index=True)

    id_matricula = Column(
        Integer,
        ForeignKey("matricula.id_matricula"),
        nullable=False
    )

    id_materia = Column(
        Integer,
        ForeignKey("materia.id_materia"),
        nullable=False
    )

    nota = Column(Numeric(4, 2))

    enrollment = relationship(
        "Enrollment",
        back_populates="grades"
    )

    subject = relationship(
        "Subject",
        back_populates="grades"
    )