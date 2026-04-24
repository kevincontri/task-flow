from pydantic import BaseModel, Field, AwareDatetime, ConfigDict
from ..core.enums import TaskPriority, TaskStatus
from datetime import datetime


class TaskBase(BaseModel):
    name: str = Field(..., description="Name of the task", min_length=3, max_length=32)
    description: str | None = Field(
        default=None,
        description="Description of the task",
        min_length=3,
        max_length=256,
    )


class TaskCreate(TaskBase):
    status: TaskStatus = Field(TaskStatus.TODO, description="Status of the task")
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM, description="Priority of the task"
    )
    deadline: datetime = Field(..., description="Deadline of the task")


class TaskUpdate(BaseModel):
    name: str | None = Field(default=None, description="Update Name of the task")
    description: str | None = Field(
        default=None,
        description="Update Description of the task",
        min_length=3,
        max_length=256,
    )
    status: TaskStatus | None = Field(
        default=None, description="Update Status of the task"
    )
    priority: TaskPriority | None = Field(
        default=None, description="Update Priority of the task"
    )
    deadline: AwareDatetime | None = Field(
        default=None, description="Update Deadline of the task"
    )

    model_config = ConfigDict(from_attributes=True)


class TaskResponse(TaskCreate):
    id: int
    project_id: int
    created_at: AwareDatetime

    model_config = ConfigDict(from_attributes=True)


class TaskMoveRequest(BaseModel):
    status: TaskStatus = Field(..., description="Status of the task for moving")

    model_config = ConfigDict(from_attributes=True)
