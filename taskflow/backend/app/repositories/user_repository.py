from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.user import User
from typing import Any


async def get_user_by_email(session: AsyncSession, user_email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == user_email))
    return result.scalar_one_or_none()


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(session: AsyncSession, hashed_password: str, **user: Any) -> User:
    db_user = User(
        username=user["username"],
        email=user["email"],
        hashed_password=hashed_password,
    )
    session.add(db_user)
    try:
        await session.commit()
        await session.refresh(db_user)
        return db_user
    except Exception:
        await session.rollback()
        raise
