from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.class_group import ClassGroup
from app.schemas.class_group import (
    ClassGroupCreate,
    ClassGroupUpdate,
    ClassGroupResponse
)

router = APIRouter(
    prefix="/class_groups",
    tags=["ClassGroups"]
)


@router.get("/", response_model=list[ClassGroupResponse])
def get_class_groups(db: Session = Depends(get_db)):
    return db.query(ClassGroup).all()


@router.get("/{class_group_id}", response_model=ClassGroupResponse)
def get_class_group(class_group_id: int, db: Session = Depends(get_db)):
    class_group = (
        db.query(ClassGroup)
        .filter(ClassGroup.id_turma == class_group_id)
        .first()
    )

    if not class_group:
        raise HTTPException(
            status_code=404,
            detail="ClassGroup not found"
        )

    return class_group


@router.post("/", response_model=ClassGroupResponse, status_code=201)
def create_class_group(
    class_group_data: ClassGroupCreate,
    db: Session = Depends(get_db)
):
    class_group = ClassGroup(**class_group_data.model_dump())

    db.add(class_group)
    db.commit()
    db.refresh(class_group)

    return class_group


@router.put("/{class_group_id}", response_model=ClassGroupResponse)
def update_class_group(
    class_group_id: int,
    class_group_data: ClassGroupUpdate,
    db: Session = Depends(get_db)
):
    class_group = (
        db.query(ClassGroup)
        .filter(ClassGroup.id_turma == class_group_id)
        .first()
    )

    if not class_group:
        raise HTTPException(
            status_code=404,
            detail="ClassGroup not found"
        )

    for key, value in class_group_data.model_dump(
        exclude_unset=True
    ).items():
        setattr(class_group, key, value)

    db.commit()
    db.refresh(class_group)

    return class_group


@router.delete("/{class_group_id}")
def delete_class_group(
    class_group_id: int,
    db: Session = Depends(get_db)
):
    class_group = (
        db.query(ClassGroup)
        .filter(ClassGroup.id_turma == class_group_id)
        .first()
    )

    if not class_group:
        raise HTTPException(
            status_code=404,
            detail="ClassGroup not found"
        )

    db.delete(class_group)
    db.commit()

    return {"message": "ClassGroup deleted successfully"}