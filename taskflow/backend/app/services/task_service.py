from ..repositories.task_repository import (
    create_task_repo,
    get_tasks_by_project_repo,
    get_tasks_by_status_repo,
    get_task_by_id_repo,
    update_task_status,
    update_task_repo,
    delete_task_repo,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskUpdate
from ..exceptions.exceptions import DatabaseError, NotFoundError
from ..repositories.project_repository import get_project_by_id_repo


async def create_task(
    session: AsyncSession, task: TaskCreate, project_id: int, owner_id: int
) -> Task:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")
    try:
        new_task = await create_task_repo(task, session, project_id)
        return new_task
    except SQLAlchemyError:
        raise DatabaseError("Database Transaction Error")


async def get_tasks_by_project(
    session: AsyncSession, project_id: int, owner_id: int
) -> list:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")
    result = await get_tasks_by_project_repo(session, project_id)
    return result


async def get_tasks_by_status(
    session: AsyncSession, status: str, project_id: int, owner_id: int
) -> list:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")
    result = await get_tasks_by_status_repo(session, status)
    return result


async def get_task_by_id(
    session: AsyncSession, task_id: int, project_id: int, owner_id: int
) -> Task:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")
    result = await get_task_by_id_repo(session, task_id)
    if result is None:
        raise NotFoundError("Task Not Found")
    return result


async def update_task(
    session: AsyncSession,
    task_id: int,
    project_id: int,
    owner_id: int,
    task_data: TaskUpdate,
) -> Task:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")

    task = await get_task_by_id_repo(session, task_id)
    if task is None:
        raise NotFoundError("Task Not Found")

    result = await update_task_repo(session, task_id, task_data)
    return result


async def delete_task(
    session: AsyncSession, task_id: int, project_id: int, owner_id: int
):
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")

    task = await get_task_by_id_repo(session, task_id)
    if task is None:
        raise NotFoundError("Task Not Found")

    await delete_task_repo(session, task_id)


async def update_task_status(
    session: AsyncSession, task_id: int, project_id: int, owner_id: int, status: str
):
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is None:
        raise NotFoundError("Project Not Found")

    task = await get_task_by_id_repo(session, task_id)
    if task is None:
        raise NotFoundError("Task Not Found")

    updated_task = await update_task_status(session, task_id, status)
    return updated_task
