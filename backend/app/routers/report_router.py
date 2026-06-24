from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

VIEWS_RELATORIOS = {
    "boletim-aluno": "vw_boletim_aluno",
    "existencia-aluno": "vw_existencia_aluno",
    "frequencia-aluno": "vw_frequencia_aluno",
    "grade-turma": "vw_grade_turma",
    "media-aluno-materia": "vw_media_aluno_materia",
    "professor-disciplinas": "vw_professor_disciplinas",
    "frequencia-menor-media": "vw_frequencia_menormedia",
}


@router.get("/{tipo}")
def listar_relatorio(tipo: str, db: Session = Depends(get_db)):
    if tipo not in VIEWS_RELATORIOS:
        raise HTTPException(
            status_code=404,
            detail="Relatório não encontrado"
        )

    nome_view = VIEWS_RELATORIOS[tipo]

    try:
        resultado = db.execute(
            text(f"SELECT * FROM {nome_view}")
        ).mappings().all()

        return [dict(linha) for linha in resultado]

    except Exception as erro:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar relatório: {str(erro)}"
        )