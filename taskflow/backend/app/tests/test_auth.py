import pytest

@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(
        "/auth/register",
        json={
            "email": "example@example.com",
            "username": "exampleName",
            "password": "examplePassword",
        },
    )
    assert response.status_code == 201
    assert response.json()["email"] == "example@example.com"
    assert "password" not in response.json()

@pytest.mark.asyncio
async def test_register_duplicated(client):
    await client.post(
        "/auth/register",
        json={
            "email": "example@example.com",
            "username": "exampleName",
            "password": "examplePassword",
        },
    )
    response = await client.post(
        "/auth/register",
        json={
            "email": "example@example.com",
            "username": "exampleName",
            "password": "examplePassword",
        },
    )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_login(client):
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
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "token_type" in response.json()

@pytest.mark.asyncio
async def test_login_wrong_ps(client):
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
        json={"email": "example@example.com", "password": "wrongPassword"},
    )
    assert response.status_code == 401
