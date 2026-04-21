from pydantic import BaseModel, Field, AwareDatetime, ConfigDict


class ProjectBase(BaseModel):
    name: str = Field(
        ..., description="Name of the project", min_length=3, max_length=32
    )
    description: str = Field(
        ..., description="Description of the project", min_length=3, max_length=256
    )


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    name: str | None = Field(default=None, description="Name of the project")
    description: str | None = Field(
        default=None, description="Description of the project"
    )


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int = Field(..., description="ID of the project")
    created_at: AwareDatetime = Field(..., description="Creation date of the project")
    owner_id: int = Field(..., description="ID of the project owner")
