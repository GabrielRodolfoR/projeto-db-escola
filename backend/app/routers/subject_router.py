from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.subject import Subject
from app.schemas.subject import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse
)

router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"]
)


@router.get("/", response_model=list[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = (
        db.query(Subject)
        .filter(Subject.id_materia == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject


@router.post("/", response_model=SubjectResponse, status_code=201)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db)
):
    subject = Subject(**subject_data.model_dump())

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return subject


@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    subject_data: SubjectUpdate,
    db: Session = Depends(get_db)
):
    subject = (
        db.query(Subject)
        .filter(Subject.id_materia == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    for key, value in subject_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(subject, key, value)

    db.commit()
    db.refresh(subject)

    return subject


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = (
        db.query(Subject)
        .filter(Subject.id_materia == subject_id)
        .first()
    )

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    db.delete(subject)
    db.commit()

    return {"message": "Subject deleted successfully"}