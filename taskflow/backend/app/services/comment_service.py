from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.comment_repository import (
    create_comment_repo,
    get_comments_repo,
    get_comment_by_id_repo,
    delete_comment_repo,
)
from ..schemas.comment import CommentCreate
from ..models.comment import Comment
from ..exceptions.exceptions import NotFoundError


async def create_comment(
    session: AsyncSession,
    comment: CommentCreate,
    task_id: int,
    author_id: int,
) -> Comment:
    return await create_comment_repo(session, comment, task_id, author_id)


async def get_comments(
    session: AsyncSession, task_id: int, project_id: int, author_id: int
) -> list:
    return await get_comments_repo(session, task_id, author_id)


async def get_comment_by_id(
    session: AsyncSession,
    author_id: int,
    comment_id: int,
) -> Comment:
    comment = await get_comment_by_id_repo(session, comment_id, author_id)
    if comment is None:
        raise NotFoundError("Comment Not Found")
    return comment


async def delete_comment(
    session: AsyncSession,
    author_id: int,
    comment_id: int,
) -> None:
    comment = await get_comment_by_id_repo(session, comment_id, author_id)
    if comment is None:
        raise NotFoundError("Comment Not Found")
    await delete_comment_repo(session, comment_id)
