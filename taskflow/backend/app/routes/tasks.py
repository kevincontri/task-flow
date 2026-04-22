from fastapi import APIRouter, Depends, HTTPException
from ..core.database import get_db
from ..core.deps import get_current_user
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
from ..exceptions.exceptions import NotFoundError, DatabaseError

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["tasks"])


@router.post("", status_code=201, response_model=TaskResponse)
async def create_task_route(
    project_id: int,
    task: TaskCreate,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        new_task = await create_task(session, task, project_id, int(user.id))
        return new_task
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=list[TaskResponse], status_code=200)
async def get_tasks_by_project_route(
    project_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        tasks = await get_tasks_by_project(session, project_id, int(user.id))
        return tasks
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{task_id}", response_model=TaskResponse, status_code=200)
async def get_task_by_id_route(
    project_id: int,
    task_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        task = await get_task_by_id(session, task_id, project_id, int(user.id))
        return task
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{task_id}", response_model=TaskResponse, status_code=200)
async def update_task_route(
    project_id: int,
    task_id: int,
    task: TaskUpdate,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        updated_task = await update_task(
            session, task_id, project_id, int(user.id), task
        )
        return updated_task
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{task_id}", status_code=204)
async def delete_task_route(
    project_id: int,
    task_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        await delete_task(session, task_id, project_id, int(user.id))
        return
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/{task_id}/move", response_model=TaskResponse, status_code=200)
async def move_task_route(
    project_id: int,
    task_id: int,
    status: TaskMoveRequest,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        updated_task = await update_task_status(
            session, task_id, project_id, int(user.id), status
        )
        return updated_task
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
