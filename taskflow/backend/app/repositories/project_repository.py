from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from ..models.project import Project
from typing import Any


async def create_project_repo(
    session: AsyncSession, owner_id: int, **project: Any
) -> Project:
    db_project = Project(owner_id=owner_id, **project)
    session.add(db_project)
    await session.commit()
    await session.refresh(db_project)
    return db_project


async def get_projects_repo(session: AsyncSession, owner_id: int) -> list:
    result = await session.execute(select(Project).where(Project.owner_id == owner_id))
    return result.scalars().all()


async def get_project_by_id_repo(
    session: AsyncSession, project_id: int, owner_id: int
) -> Project | None:
    result = await session.execute(
        select(Project).where(Project.id == project_id, Project.owner_id == owner_id)
    )
    return result.scalar_one_or_none()


async def update_project_repo(
    session: AsyncSession, project_id: int, **project_data: Any
) -> Project:
    result = await session.execute(
        update(Project)
        .where(Project.id == project_id)
        .values(**project_data)
        .returning(Project)
    )
    await session.commit()
    return result.scalars().first()


async def delete_project_repo(session: AsyncSession, project_id: int):
    await session.execute(delete(Project).where(Project.id == project_id))
    await session.commit()
