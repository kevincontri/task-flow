# type: ignore
from sqlalchemy import String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import List

from app.core.database import Base
from app.core.enums import TaskStatus, TaskPriority


class Task(Base):
    __tablename__ = "task"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, values_callable=lambda x: [e.value for e in x]), nullable=False
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    project_id: Mapped[int] = mapped_column(
        ForeignKey("project.id", ondelete="CASCADE")
    )
    project: Mapped["Project"] = relationship("Project", back_populates="tasks")
    comments: Mapped[List["Comment"]] = relationship(
        "Comment",
        back_populates="task",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
