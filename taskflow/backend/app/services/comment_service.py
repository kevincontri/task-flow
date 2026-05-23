from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.comment_repository import (
    create_comment_repo,
    get_comments_repo,
    get_comment_by_id_repo,
    delete_comment_repo,
)
from ..models.comment import Comment
from ..schemas.comment import CommentResponse
import json
from ..exceptions.exceptions import NotFoundError
from typing import Any
from ..core.redis.redis_repository import RedisRepository


async def create_comment(
    session: AsyncSession,
    task_id: int,
    author_id: int,
    r: RedisRepository,
    **comment: Any,
) -> Comment:
    await r.delete(f"comments:{task_id}")
    return await create_comment_repo(session, task_id, author_id, **comment)


async def get_comments(
    session: AsyncSession,
    task_id: int,
    author_id: int,
    r: RedisRepository,
) -> list:
    cache_key = f"comments:{task_id}"

    cached = await r.get(cache_key)

    if cached:
        return [CommentResponse(**c) for c in json.loads(cached)]

    result = await get_comments_repo(session, task_id, author_id)

    serializable = [
        CommentResponse.model_validate(c).model_dump(mode="json") for c in result
    ]

    await r.insert_ex(cache_key, json.dumps(serializable), 3600)

    return result


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
    r: RedisRepository,
    task_id: int,
) -> None:
    comment = await get_comment_by_id_repo(session, comment_id, author_id)
    if comment is None:
        raise NotFoundError("Comment Not Found")
    await r.delete(f"comments:{task_id}")
    await delete_comment_repo(session, comment_id)
