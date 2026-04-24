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
