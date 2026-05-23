from ..repositories.task_repository import (
    create_task_repo,
    get_tasks_by_project_repo,
    get_task_by_id_repo,
    update_task_status_repo,
    update_task_repo,
    delete_task_repo,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.task import Task
from ..exceptions.exceptions import DatabaseError, NotFoundError
from typing import Any
from ..core.redis.redis_repository import RedisRepository
import json
from ..schemas.task import TaskResponse


async def create_task(
    session: AsyncSession, project_id: int, r: RedisRepository, **task: Any
) -> Task:
    try:
        new_task = await create_task_repo(session, project_id, **task)
        await r.delete(f"tasks:{project_id}")
        return new_task
    except SQLAlchemyError:
        raise DatabaseError("Database Transaction Error")


async def get_tasks_by_project(
    session: AsyncSession,
    r: RedisRepository,
    project_id: int,
) -> list:
    cache_key = f"tasks:{project_id}"

    cached = await r.get(cache_key)

    if cached:
        return [TaskResponse(**t) for t in json.loads(cached)]

    result = await get_tasks_by_project_repo(session, project_id)

    serializable = [
        TaskResponse.model_validate(t).model_dump(mode="json") for t in result
    ]

    await r.insert_ex(cache_key, json.dumps(serializable), 3600)

    return result


async def get_task_by_id(
    session: AsyncSession,
    task_id: int,
) -> Task:
    result = await get_task_by_id_repo(session, task_id)
    if result is None:
        raise NotFoundError("Task Not Found")
    return result


async def update_task(
    session: AsyncSession,
    project_id: int,
    task_id: int,
    r: RedisRepository,
    **task_data: Any,
) -> Task:
    await r.delete(f"tasks:{project_id}")
    return await update_task_repo(session, task_id, **task_data)


async def delete_task(
    session: AsyncSession,
    project_id: int,
    task_id: int,
    r: RedisRepository,
):
    await r.delete(f"tasks:{project_id}")
    await delete_task_repo(session, task_id)


async def update_task_status(
    session: AsyncSession,
    project_id: int,
    task_id: int,
    status: str,
    r: RedisRepository,
):
    await r.delete(f"tasks:{project_id}")
    return await update_task_status_repo(session, task_id, status)
