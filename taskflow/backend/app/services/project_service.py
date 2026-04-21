from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.project import ProjectCreate, ProjectUpdate
from ..repositories.project_repository import (
    create_project_repo,
    get_projects_repo,
    get_project_by_id_repo,
    update_project_repo,
    delete_project_repo,
)
from ..exceptions.exceptions import DatabaseError, NotFoundError, ForbiddenAccess
from ..models.project import Project
from sqlalchemy.exc import SQLAlchemyError


async def create_project(
    session: AsyncSession, project: ProjectCreate, owner_id: int
) -> Project:
    try:
        new_project = await create_project_repo(session, project, owner_id)
        return new_project
    except SQLAlchemyError:
        raise DatabaseError("Database Transaction Error")


async def get_projects(session: AsyncSession, owner_id: int) -> list:
    result = await get_projects_repo(session, owner_id)
    return result


async def get_project_by_id(
    session: AsyncSession, owner_id: int, project_id: int
) -> Project:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        return project
    raise NotFoundError("Project Not Found")


async def update_project(
    session: AsyncSession, project_id: int, project_data: ProjectUpdate, owner_id: int
) -> Project:
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        updated_project = await update_project_repo(session, project_id, project_data)
        return updated_project
    raise NotFoundError("Project Not Found")


async def delete_project(session: AsyncSession, project_id: int, owner_id: int):
    project = await get_project_by_id_repo(session, project_id, owner_id)
    if project is not None:
        await delete_project_repo(session, project_id)
        return
    raise NotFoundError("Project Not Found")
