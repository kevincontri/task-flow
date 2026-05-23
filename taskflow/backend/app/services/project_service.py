from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.project_repository import (
    create_project_repo,
    get_projects_repo,
    get_project_by_id_repo,
    update_project_repo,
    delete_project_repo,
)
from ..exceptions.exceptions import DatabaseError, NotFoundError
from ..models.project import Project
from sqlalchemy.exc import SQLAlchemyError
from typing import Any
import json
from ..schemas.project import ProjectResponse
from ..core.redis.redis_repository import RedisRepository


async def create_project(
    session: AsyncSession,
    owner_id: int,
    r: RedisRepository,
    **project: Any,
) -> Project:
    try:
        new_project = await create_project_repo(session, owner_id, **project)

        await r.delete(f"projects:{owner_id}")

        return new_project
    except SQLAlchemyError:
        raise DatabaseError("Database Transaction Error")


async def get_projects(
    session: AsyncSession,
    owner_id: int,
    r: RedisRepository,
) -> list:
    cache_key = f"projects:{owner_id}"

    cached = await r.get(cache_key)
    
    if cached:
        return [ProjectResponse(**p) for p in json.loads(cached)]

    result = await get_projects_repo(session, owner_id)

    serializable = [
        ProjectResponse.model_validate(p).model_dump(mode="json") for p in result
    ]

    await r.insert_ex(cache_key, json.dumps(serializable), 3600)

    return result


async def get_project_by_id(
    session: AsyncSession, owner_id: int, project_id: int
) -> Project:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        return project
    raise NotFoundError("Project Not Found")


async def update_project(
    session: AsyncSession,
    project_id: int,
    owner_id: int,
    r: RedisRepository,
    **project_data: Any,
) -> Project:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        updated_project = await update_project_repo(session, project_id, **project_data)
        await r.delete(f"projects:{owner_id}")
        return updated_project
    raise NotFoundError("Project Not Found")


async def delete_project(
    session: AsyncSession, project_id: int, owner_id: int, r: RedisRepository
):
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        await delete_project_repo(session, project_id)
        await r.delete(f"projects:{owner_id}")
        return
    raise NotFoundError("Project Not Found")
