from datetime import datetime, timezone
from pydantic import BaseModel, AwareDatetime, Field, ConfigDict, EmailStr, field_validator


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Email address of the user")
    username: str = Field(
        ..., description="Username of the user", min_length=3, max_length=32
    )


class UserCreate(UserBase):
    password: str = Field(
        ...,
        description="Password of the user",
        min_length=8,
        max_length=128,
    )


class UserResponse(UserBase):
    id: int
    created_at: AwareDatetime

    @field_validator("created_at", mode="before")
    @classmethod
    def assume_utc_if_naive(cls, v: datetime) -> datetime:
        if isinstance(v, datetime) and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: str = Field(..., description="Email address of the user", min_length=3)
    password: str = Field(..., description="Password of the user", min_length=8)
