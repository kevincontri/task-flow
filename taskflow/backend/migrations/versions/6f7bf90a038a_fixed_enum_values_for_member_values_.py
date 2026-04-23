"""Fixed enum values for member values instead of member names

Revision ID: 6f7bf90a038a
Revises: 99e80f0e7c79
Create Date: 2026-04-23 10:44:57.245611

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6f7bf90a038a"
down_revision: Union[str, Sequence[str], None] = "99e80f0e7c79"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "task",
        "status",
        existing_type=sa.Enum("TODO", "IN_PROGRESS", "DONE", name="taskstatus"),
        type_=sa.Enum(
            "todo",
            "in_progress",
            "done",
            name="taskstatus",
            values_callable=lambda x: [e.value for e in x],
        ),
        postgresql_using="status::text::taskstatus",
    )

    op.alter_column(
        "task",
        "priority",
        existing_type=sa.Enum("LOW", "MEDIUM", "HIGH", name="taskpriority"),
        type_=sa.Enum(
            "low",
            "medium",
            "high",
            name="taskpriority",
            values_callable=lambda x: [e.value for e in x],
        ),
        postgresql_using="priority::text::taskpriority",
    )


def downgrade() -> None:
    """Downgrade schema."""


op.alter_column(
    "task",
    "status",
    existing_type=sa.Enum(
        "todo",
        "in_progress",
        "done",
        name="taskstatus",
        values_callable=lambda x: [e.value for e in x],
    ),
    type_=sa.Enum("TODO", "IN_PROGRESS", "DONE", name="taskstatus"),
    postgresql_using="status::text::taskstatus",
)

op.alter_column(
    "task",
    "priority",
    existing_type=sa.Enum(
        "low",
        "medium",
        "high",
        name="taskpriority",
        values_callable=lambda x: [e.value for e in x],
    ),
    type_=sa.Enum("LOW", "MEDIUM", "HIGH", name="taskpriority"),
    postgresql_using="priority::text::taskpriority",
)
