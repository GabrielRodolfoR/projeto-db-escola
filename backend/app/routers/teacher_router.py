from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.teacher import Teacher
from app.schemas.teacher import (
    TeacherCreate,
    TeacherUpdate,
    TeacherResponse
)

router = APIRouter(
    prefix="/teachers",
    tags=["Teacher"]
)


@router.get("/", response_model=list[TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(Teacher).all()


@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = (
        db.query(Teacher)
        .filter(Teacher.id_professor == teacher_id)
        .first()
    )

    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    return teacher


@router.post("/", response_model=TeacherResponse, status_code=201)
def create_teacher(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db)
):
    teacher = Teacher(**teacher_data.model_dump())

    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    return teacher


@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(
    teacher_id: int,
    teacher_data: TeacherUpdate,
    db: Session = Depends(get_db)
):
    teacher = (
        db.query(Teacher)
        .filter(Teacher.id_professor == teacher_id)
        .first()
    )

    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    for key, value in teacher_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(teacher, key, value)

    db.commit()
    db.refresh(teacher)

    return teacher


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    teacher = (
        db.query(Teacher)
        .filter(Teacher.id_professor == teacher_id)
        .first()
    )

    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    db.delete(teacher)
    db.commit()

    return {"message": "Teacher deleted successfully"}