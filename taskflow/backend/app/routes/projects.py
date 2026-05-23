from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..services.project_service import (
    create_project,
    get_projects,
    get_project_by_id,
    update_project,
    delete_project,
)
from ..schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from ..core.deps import get_current_user
from typing import List
from ..core.deps import get_redis_conn
from ..core.redis.redis_repository import RedisRepository

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectResponse, status_code=201)
async def create_project_route(
    project: ProjectCreate,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    new_project = await create_project(
        session, int(user.id), redis_repo, **project.model_dump()
    )
    return new_project


@router.get("", response_model=List[ProjectResponse], status_code=200)
async def get_projects_route(
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    projects = await get_projects(session, int(user.id), redis_repo)
    return projects


@router.get("/{project_id}", response_model=ProjectResponse, status_code=200)
async def get_project_by_id_route(
    project_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    return await get_project_by_id(session, int(user.id), project_id)


@router.put("/{project_id}", response_model=ProjectResponse, status_code=200)
async def update_project_route(
    data: ProjectUpdate,
    project_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    if data.name is None and data.description is None:
        raise HTTPException(status_code=400, detail="No data provided")
    return await update_project(
        session,
        project_id,
        int(user.id),
        redis_repo,
        **data.model_dump(exclude_unset=True)
    )


@router.delete("/{project_id}", status_code=204)
async def delete_project_route(
    project_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    await delete_project(session, project_id, int(user.id), redis_repo)
    return
