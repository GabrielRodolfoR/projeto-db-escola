from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.grade import Grade
from app.schemas.grade import (
    GradeCreate,
    GradeUpdate,
    GradeResponse
)

router = APIRouter(
    prefix="/grades",
    tags=["Grades"]
)


@router.get("/", response_model=list[GradeResponse])
def get_grades(db: Session = Depends(get_db)):
    return db.query(Grade).all()


@router.get("/{grade_id}", response_model=GradeResponse)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    grade = (
        db.query(Grade)
        .filter(Grade.id_nota == grade_id)
        .first()
    )

    if not grade:
        raise HTTPException(
            status_code=404,
            detail="Grade not found"
        )

    return grade


@router.post("/", response_model=GradeResponse, status_code=201)
def create_grade(
    grade_data: GradeCreate,
    db: Session = Depends(get_db)
):
    grade = Grade(**grade_data.model_dump())

    db.add(grade)
    db.commit()
    db.refresh(grade)

    return grade


@router.put("/{grade_id}", response_model=GradeResponse)
def update_grade(
    grade_id: int,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db)
):
    grade = (
        db.query(Grade)
        .filter(Grade.id_nota == grade_id)
        .first()
    )

    if not grade:
        raise HTTPException(
            status_code=404,
            detail="Grade not found"
        )

    for key, value in grade_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(grade, key, value)

    db.commit()
    db.refresh(grade)

    return grade


@router.delete("/{grade_id}")
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db)
):
    grade = (
        db.query(Grade)
        .filter(Grade.id_nota == grade_id)
        .first()
    )

    if not grade:
        raise HTTPException(
            status_code=404,
            detail="Grade not found"
        )

    db.delete(grade)
    db.commit()

    return {"message": "Grade deleted successfully"}