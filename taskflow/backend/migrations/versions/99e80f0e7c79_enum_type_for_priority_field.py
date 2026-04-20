"""enum type for priority field

Revision ID: 99e80f0e7c79
Revises: 19ba2fae51d4
Create Date: 2026-04-20 01:00:46.392804

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '99e80f0e7c79'
down_revision: Union[str, Sequence[str], None] = '19ba2fae51d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

task_priority = sa.Enum('LOW', 'MEDIUM', 'HIGH', name='taskpriority')


def upgrade() -> None:
    task_priority.create(op.get_bind(), checkfirst=True)
    op.alter_column('task', 'priority',
               existing_type=sa.VARCHAR(),
               type_=task_priority,
               existing_nullable=False,
               postgresql_using='priority::taskpriority')


def downgrade() -> None:
    op.alter_column('task', 'priority',
               existing_type=task_priority,
               type_=sa.VARCHAR(),
               existing_nullable=False)
    task_priority.drop(op.get_bind(), checkfirst=True)
