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


async def create_task(session: AsyncSession, project_id: int, **task: Any) -> Task:
    try:
        new_task = await create_task_repo(session, project_id, **task)
        return new_task
    except SQLAlchemyError:
        raise DatabaseError("Database Transaction Error")


async def get_tasks_by_project(
    session: AsyncSession,
    project_id: int,
) -> list:
    result = await get_tasks_by_project_repo(session, project_id)
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
    task_id: int,
    **task_data: Any,
) -> Task:
    return await update_task_repo(session, task_id, **task_data)


async def delete_task(
    session: AsyncSession,
    task_id: int,
):
    await delete_task_repo(session, task_id)


async def update_task_status(session: AsyncSession, task_id: int, status: str):
    return await update_task_status_repo(session, task_id, status)
