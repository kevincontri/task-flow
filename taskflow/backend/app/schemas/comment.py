from pydantic import BaseModel, Field, AwareDatetime, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
