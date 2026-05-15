from fastapi import APIRouter, Depends
from ..core.database import get_db
from ..core.deps import get_owned_project, task_exists
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.task import TaskCreate, TaskResponse, TaskUpdate, TaskMoveRequest
from ..services.task_service import (
    create_task,
    get_tasks_by_project,
    get_task_by_id,
    update_task_status,
    update_task,
    delete_task,
)

router = APIRouter(
    prefix="/projects/{project_id}/tasks",
    tags=["tasks"],
    dependencies=[Depends(get_owned_project)],
)


@router.post("", status_code=201, response_model=TaskResponse)
async def create_task_route(
    project_id: int,
    task: TaskCreate,
    session: AsyncSession = Depends(get_db),
):
    # return tasks as a **kwarg to avoid circular dependency issues
    return await create_task(session, project_id, **task.model_dump())


@router.get("", response_model=list[TaskResponse], status_code=200)
async def get_tasks_by_project_route(
    project_id: int,
    session: AsyncSession = Depends(get_db),
):
    return await get_tasks_by_project(session, project_id)


@router.get("/{task_id}", response_model=TaskResponse, status_code=200)
async def get_task_by_id_route(
    task_id: int,
    session: AsyncSession = Depends(get_db),
):
    return await get_task_by_id(session, task_id)


@router.put("/{task_id}", response_model=TaskResponse, status_code=200)
async def update_task_route(
    task_id: int,
    task: TaskUpdate,
    session: AsyncSession = Depends(get_db),
    task_exists=Depends(task_exists),
):
    return await update_task(session, task_id, **task.model_dump(exclude_unset=True))


@router.delete("/{task_id}", status_code=204)
async def delete_task_route(
    task_id: int,
    session: AsyncSession = Depends(get_db),
    task_exists=Depends(task_exists),
):
    return await delete_task(session, task_id)


@router.patch("/{task_id}/move", response_model=TaskResponse, status_code=200)
async def move_task_route(
    task_id: int,
    status: TaskMoveRequest,
    session: AsyncSession = Depends(get_db),
    task_exists=Depends(task_exists),
):
    return await update_task_status(session, task_id, status.status)
