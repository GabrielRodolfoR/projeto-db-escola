from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.lesson import Lesson
from app.schemas.lesson import (
    LessonCreate,
    LessonUpdate,
    LessonResponse
)

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"]
)


@router.get("/", response_model=list[LessonResponse])
def get_lessons(db: Session = Depends(get_db)):
    return db.query(Lesson).all()


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id_aula == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    return lesson


@router.post("/", response_model=LessonResponse, status_code=201)
def create_lesson(
    lesson_data: LessonCreate,
    db: Session = Depends(get_db)
):
    lesson = Lesson(**lesson_data.model_dump())

    db.add(lesson)
    db.commit()
    db.refresh(lesson)

    return lesson


@router.put("/{lesson_id}", response_model=LessonResponse)
def update_lesson(
    lesson_id: int,
    lesson_data: LessonUpdate,
    db: Session = Depends(get_db)
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id_aula == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    for key, value in lesson_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(lesson, key, value)

    db.commit()
    db.refresh(lesson)

    return lesson


@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    lesson = (
        db.query(Lesson)
        .filter(Lesson.id_aula == lesson_id)
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Lesson not found"
        )

    db.delete(lesson)
    db.commit()

    return {"message": "Lesson deleted successfully"}