from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.comment_repository import (
    create_comment_repo,
    get_comments_repo,
    get_comment_by_id_repo,
    delete_comment_repo,
)
from ..schemas.comment import CommentCreate
from ..services.task_service import get_task_by_id
from ..models.comment import Comment
from ..exceptions.exceptions import NotFoundError

# TODO : When implementing routes, add error handling for get_task_by_id
# TODO: When creating a class for each service and repo, add one single function o check if user is the owner of the project and task


async def create_comment(
    session: AsyncSession,
    comment: CommentCreate,
    task_id: int,
    project_id: int,
    author_id: int,
) -> Comment:
    await get_task_by_id(session, task_id, project_id, author_id)
    return await create_comment_repo(session, comment, task_id, author_id)


async def get_comments(
    session: AsyncSession, task_id: int, project_id: int, author_id: int
) -> list:
    await get_task_by_id(session, task_id, project_id, author_id)
    return await get_comments_repo(session, task_id, author_id)


async def get_comment_by_id(
    session: AsyncSession,
    task_id: int,
    project_id: int,
    author_id: int,
    comment_id: int,
) -> Comment:
    await get_task_by_id(session, task_id, project_id, author_id)
    comment = await get_comment_by_id_repo(session, comment_id, author_id)
    if comment is None:
        raise NotFoundError("Comment Not Found")
    return comment


async def delete_comment(
    session: AsyncSession,
    task_id: int,
    project_id: int,
    author_id: int,
    comment_id: int,
) -> None:
    await get_task_by_id(session, task_id, project_id, author_id)
    await delete_comment_repo(session, comment_id)
