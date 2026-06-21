from fastapi import FastAPI

from app.routers.student_router import router as student_router
from app.routers.teacher_router import router as teacher_router
from app.routers.subject_router import router as subject_router
from app.routers.class_group_router import router as class_group_router
from app.routers.enrollment_router import router as enrollment_router
from app.routers.class_subject_router import router as class_subject_router
from app.routers.lesson_router import router as lesson_router
from app.routers.grade_router import router as grade_router
from app.routers.attendance_router import router as attendance_router
from app.routers.user_router import router as user_router

app = FastAPI(
    title="School Management API"
)

app.include_router(student_router)
app.include_router(teacher_router)
app.include_router(subject_router)
app.include_router(class_group_router)
app.include_router(enrollment_router)
app.include_router(class_subject_router)
app.include_router(lesson_router)
app.include_router(grade_router)
app.include_router(attendance_router)
app.include_router(user_router)