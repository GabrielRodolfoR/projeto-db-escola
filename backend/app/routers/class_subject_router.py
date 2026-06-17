from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.class_subject import ClassSubject
from app.schemas.class_subject import (
    ClassSubjectCreate,
    ClassSubjectUpdate,
    ClassSubjectResponse
)

router = APIRouter(
    prefix="/class_subjects",
    tags=["ClassSubjects"]
)


@router.get("/", response_model=list[ClassSubjectResponse])
def get_class_subjects(db: Session = Depends(get_db)):
    return db.query(ClassSubject).all()


@router.get("/{class_subject_id}", response_model=ClassSubjectResponse)
def get_class_subject(class_subject_id: int, db: Session = Depends(get_db)):
    class_subject = (
        db.query(ClassSubject)
        .filter(ClassSubject.id_turma_materia == class_subject_id)
        .first()
    )

    if not class_subject:
        raise HTTPException(
            status_code=404,
            detail="ClassSubject not found"
        )

    return class_subject


@router.post("/", response_model=ClassSubjectResponse, status_code=201)
def create_class_subject(
    class_subject_data: ClassSubjectCreate,
    db: Session = Depends(get_db)
):
    class_subject = ClassSubject(**class_subject_data.model_dump())

    db.add(class_subject)
    db.commit()
    db.refresh(class_subject)

    return class_subject


@router.put("/{class_subject_id}", response_model=ClassSubjectResponse)
def update_class_subject(
    class_subject_id: int,
    class_subject_data: ClassSubjectUpdate,
    db: Session = Depends(get_db)
):
    class_subject = (
        db.query(ClassSubject)
        .filter(ClassSubject.id_turma_materia == class_subject_id)
        .first()
    )

    if not class_subject:
        raise HTTPException(
            status_code=404,
            detail="ClassSubject not found"
        )

    for key, value in class_subject_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(class_subject, key, value)

    db.commit()
    db.refresh(class_subject)

    return class_subject


@router.delete("/{class_subject_id}")
def delete_class_subject(
    class_subject_id: int,
    db: Session = Depends(get_db)
):
    class_subject = (
        db.query(ClassSubject)
        .filter(ClassSubject.id_turma_materia == class_subject_id)
        .first()
    )

    if not class_subject:
        raise HTTPException(
            status_code=404,
            detail="ClassSubject not found"
        )

    db.delete(class_subject)
    db.commit()

    return {"message": "ClassSubject deleted successfully"}