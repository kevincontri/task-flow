from pydantic import BaseModel, Field, AwareDatetime, ConfigDict


class CommentBase(BaseModel):
    content: str = Field(
        ..., description="Content of the comment", min_length=3, max_length=256
    )


class CommentCreate(CommentBase):
    task_id: int = Field(..., description="ID of the task")


class CommentResponse(CommentBase):
    id: int
    created_at: AwareDatetime
    
    model_config = ConfigDict(from_attributes=True)


class CommentUpdate(BaseModel):
    content: str | None = Field(default=None, description="Content of the comment")

    model_config = ConfigDict(from_attributes=True)