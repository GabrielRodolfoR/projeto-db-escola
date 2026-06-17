from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.attendance import Attendance
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse
)

router = APIRouter(
    prefix="/attendances",
    tags=["Attendances"]
)


@router.get("/", response_model=list[AttendanceResponse])
def get_attendances(db: Session = Depends(get_db)):
    return db.query(Attendance).all()


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: int, db: Session = Depends(get_db)):
    attendance = (
        db.query(Attendance)
        .filter(Attendance.id_frequencia == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    return attendance


@router.post("/", response_model=AttendanceResponse, status_code=201)
def create_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db)
):
    attendance = Attendance(**attendance_data.model_dump())

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance


@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceUpdate,
    db: Session = Depends(get_db)
):
    attendance = (
        db.query(Attendance)
        .filter(Attendance.id_frequencia == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    for key, value in attendance_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(attendance, key, value)

    db.commit()
    db.refresh(attendance)

    return attendance


@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    attendance = (
        db.query(Attendance)
        .filter(Attendance.id_frequencia == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance not found"
        )

    db.delete(attendance)
    db.commit()

    return {"message": "Attendance deleted successfully"}