from pydantic import BaseModel, Field, AwareDatetime, ConfigDict, field_validator
from datetime import datetime, timezone


class CommentBase(BaseModel):
    content: str = Field(
        ..., description="Content of the comment", min_length=3, max_length=256
    )


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    id: int
    created_at: AwareDatetime
    task_id: int
    author_id: int

    @field_validator("created_at", mode="before")
    @classmethod
    def assume_utc_if_naive(cls, v: datetime) -> datetime:
        if isinstance(v, datetime) and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v

    model_config = ConfigDict(from_attributes=True)
