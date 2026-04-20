from pydantic import BaseModel, Field, AwareDatetime, ConfigDict
from enum import Enum


class TaskStatus(str, Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class TaskPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class TaskBase(BaseModel):
    name: str = Field(..., description="Name of the task", min_length=3, max_length=32)
    description: str | None = Field(
        default=None,
        description="Description of the task",
        min_length=3,
        max_length=256,
    )


class TaskCreate(TaskBase):
    status: TaskStatus = Field(..., description="Status of the task")
    priority: TaskPriority = Field(..., description="Priority of the task")
    deadline: AwareDatetime = Field(..., description="Deadline of the task")


class TaskUpdate(BaseModel):
    name: str | None = Field(..., description="Name of the task")
    description: str | None = Field(
        default=None,
        description="Description of the task",
        min_length=3,
        max_length=256,
    )
    status: TaskStatus | None = Field(default=None, description="Status of the task")
    priority: TaskPriority | None = Field(
        default=None, description="Priority of the task"
    )
    deadline: AwareDatetime | None = Field(
        default=None, description="Deadline of the task"
    )

    class Config:
        orm_mode = True


class TaskResponse(TaskCreate):
    id: int
    created_at: AwareDatetime

    model_config = ConfigDict(from_attributes=True)
