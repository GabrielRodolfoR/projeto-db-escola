from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.enrollment import Enrollment
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentResponse
)

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


@router.get("/", response_model=list[EnrollmentResponse])
def get_enrollments(db: Session = Depends(get_db)):
    return db.query(Enrollment).all()


@router.get("/{enrollment_id}", response_model=EnrollmentResponse)
def get_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.id_matricula == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found"
        )

    return enrollment


@router.post("/", response_model=EnrollmentResponse, status_code=201)
def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db)
):
    enrollment = Enrollment(**enrollment_data.model_dump())

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment


@router.put("/{enrollment_id}", response_model=EnrollmentResponse)
def update_enrollment(
    enrollment_id: int,
    enrollment_data: EnrollmentUpdate,
    db: Session = Depends(get_db)
):
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.id_matricula == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found"
        )

    for key, value in enrollment_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(enrollment, key, value)

    db.commit()
    db.refresh(enrollment)

    return enrollment


@router.delete("/{enrollment_id}")
def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db)
):
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.id_matricula == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found"
        )

    db.delete(enrollment)
    db.commit()

    return {"message": "Enrollment deleted successfully"}