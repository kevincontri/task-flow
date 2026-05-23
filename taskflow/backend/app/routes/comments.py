from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..services.comment_service import (
    create_comment,
    get_comments,
    get_comment_by_id,
    delete_comment,
)
from ..schemas.comment import CommentCreate, CommentResponse
from ..core.deps import (
    get_current_user,
    get_owned_project,
    task_exists,
    get_redis_conn,
)
from ..core.redis.redis_repository import RedisRepository

router = APIRouter(
    prefix="/projects/{project_id}/tasks/{task_id}/comments",
    tags=["comments"],
    dependencies=[Depends(get_owned_project), Depends(task_exists)],
)


@router.post("", response_model=CommentResponse, status_code=201)
async def create_comment_route(
    project_id: int,
    task_id: int,
    comment: CommentCreate,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    return await create_comment(
        session,
        task_id,
        int(user.id),
        redis_repo,
        **comment.model_dump(),
    )


@router.get("", response_model=list[CommentResponse], status_code=200)
async def get_comments_route(
    project_id: int,
    task_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    return await get_comments(session, task_id, int(user.id), redis_repo)


@router.get("/{comment_id}", response_model=CommentResponse, status_code=200)
async def get_comment_by_id_route(
    project_id: int,
    task_id: int,
    comment_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    return await get_comment_by_id(session, int(user.id), comment_id)


@router.delete("/{comment_id}", status_code=204)
async def delete_comment_route(
    project_id: int,
    task_id: int,
    comment_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
    redis_repo: RedisRepository = Depends(get_redis_conn),
):
    await delete_comment(session, int(user.id), comment_id, redis_repo, task_id)
    return
