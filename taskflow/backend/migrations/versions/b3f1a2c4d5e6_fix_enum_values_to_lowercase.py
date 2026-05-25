"""fix enum values to lowercase

Revision ID: b3f1a2c4d5e6
Revises: 5d254799dbb3
Create Date: 2026-05-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b3f1a2c4d5e6"
down_revision: Union[str, Sequence[str], None] = "5d254799dbb3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()

    status_values = [
        row[0] for row in conn.execute(sa.text("SELECT unnest(enum_range(NULL::taskstatus))::text"))
    ]
    if "TODO" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'TODO' TO 'todo'")
    if "IN_PROGRESS" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'IN_PROGRESS' TO 'in_progress'")
    if "DONE" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'DONE' TO 'done'")

    priority_values = [
        row[0] for row in conn.execute(sa.text("SELECT unnest(enum_range(NULL::taskpriority))::text"))
    ]
    if "LOW" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'LOW' TO 'low'")
    if "MEDIUM" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'MEDIUM' TO 'medium'")
    if "HIGH" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'HIGH' TO 'high'")


def downgrade() -> None:
    conn = op.get_bind()

    status_values = [
        row[0] for row in conn.execute(sa.text("SELECT unnest(enum_range(NULL::taskstatus))::text"))
    ]
    if "todo" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'todo' TO 'TODO'")
    if "in_progress" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'in_progress' TO 'IN_PROGRESS'")
    if "done" in status_values:
        op.execute("ALTER TYPE taskstatus RENAME VALUE 'done' TO 'DONE'")

    priority_values = [
        row[0] for row in conn.execute(sa.text("SELECT unnest(enum_range(NULL::taskpriority))::text"))
    ]
    if "low" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'low' TO 'LOW'")
    if "medium" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'medium' TO 'MEDIUM'")
    if "high" in priority_values:
        op.execute("ALTER TYPE taskpriority RENAME VALUE 'high' TO 'HIGH'")
