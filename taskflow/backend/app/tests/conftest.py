from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.database import Base, get_db
import pytest
from app.main import app
import httpx
from httpx import ASGITransport

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
TEST_SECRET_KEY = "test-secret-key"


@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture(scope="function")
async def db_session(engine):
    AsyncSessionLocal = async_sessionmaker(
        engine, expire_on_commit=False, class_=AsyncSession
    )
    async with AsyncSessionLocal() as session:
        yield session


@pytest.fixture(scope="function")
async def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session

    transport = ASGITransport(app=app)

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
async def authenticated_client(client):
    await client.post(
        "/auth/register",
        json={
            "email": "example@example.com",
            "username": "exampleName",
            "password": "examplePassword",
        },
    )
    response = await client.post(
        "/auth/login",
        json={"email": "example@example.com", "password": "examplePassword"},
    )
    access_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    transport = ASGITransport(app=app)

    async with httpx.AsyncClient(
        transport=transport, base_url="http://test", headers=headers
    ) as ac:
        yield ac
