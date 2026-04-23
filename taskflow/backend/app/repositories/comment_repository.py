from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from ..models.comment import Comment
from ..schemas.comment import CommentCreate


async def create_comment_repo(
    session: AsyncSession, comment: CommentCreate, task_id: int, author_id: int
) -> Comment:
    db_comment = Comment(**comment.model_dump(), task_id=task_id, author_id=author_id)
    session.add(db_comment)
    await session.commit()
    await session.refresh(db_comment)
    return db_comment


async def get_comments_repo(
    session: AsyncSession, task_id: int, author_id: int
) -> list:
    result = await session.execute(
        select(Comment).where(
            Comment.task_id == task_id, Comment.author_id == author_id
        )
    )
    return result.scalars().all()


async def get_comment_by_id_repo(
    session: AsyncSession, comment_id: int, author_id: int
) -> Comment | None:
    result = await session.execute(
        select(Comment).where(Comment.id == comment_id, Comment.author_id == author_id)
    )
    return result.scalar_one_or_none()


async def delete_comment_repo(session: AsyncSession, comment_id: int):
    await session.execute(delete(Comment).where(Comment.id == comment_id))
    await session.commit()
