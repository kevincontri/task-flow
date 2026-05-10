from ..models.task import Task
from ..models.comment import Comment
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from ..schemas.task import TaskCreate, TaskUpdate


async def create_task_repo(
    task: TaskCreate, session: AsyncSession, project_id: int
) -> Task:
    new_task = Task(
        name=task.name,
        description=task.description,
        status=task.status,
        priority=task.priority,
        deadline=task.deadline,
        project_id=project_id,
    )
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    return new_task


async def get_tasks_by_project_repo(session: AsyncSession, project_id: int) -> list:
    result = await session.execute(select(Task).where(Task.project_id == project_id))
    return result.scalars().all()


async def get_tasks_by_status_repo(session: AsyncSession, status: str) -> list:
    result = await session.execute(select(Task).where(Task.status == status))
    return result.scalars().all()


async def get_task_by_id_repo(session: AsyncSession, task_id: int) -> Task | None:
    result = await session.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def update_task_repo(
    session: AsyncSession, task_id: int, task_data: TaskUpdate
) -> Task:
    update_data = task_data.model_dump(exclude_unset=True)
    result = await session.execute(
        update(Task).where(Task.id == task_id).values(**update_data).returning(Task)
    )
    await session.commit()
    return result.scalars().first()


async def delete_task_repo(session: AsyncSession, task_id: int):
    # Delete dependent comments first to avoid FK constraint violations
    await session.execute(delete(Comment).where(Comment.task_id == task_id))
    await session.execute(delete(Task).where(Task.id == task_id))
    await session.commit()


async def update_task_status_repo(session: AsyncSession, task_id: int, status: str):
    result = await session.execute(
        update(Task).where(Task.id == task_id).values(status=status).returning(Task)
    )
    await session.commit()
    return result.scalar_one_or_none()
