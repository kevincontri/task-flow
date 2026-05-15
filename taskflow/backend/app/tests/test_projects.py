import pytest


@pytest.mark.asyncio
async def test_create_projects(authenticated_client):
    response = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )

    assert response.status_code == 201
    assert "id" in response.json()
    assert "created_at" in response.json()
    assert "owner_id" in response.json()


@pytest.mark.asyncio
async def test_get_projects(authenticated_client):
    response = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )

    response = await authenticated_client.get("/projects")

    assert response.status_code == 200
    assert "id" in response.json()[0]
    assert "created_at" in response.json()[0]
    assert "owner_id" in response.json()[0]


@pytest.mark.asyncio
async def test_projects_wrong(authenticated_client):
    no_project = await authenticated_client.get("/projects/999")
    assert no_project.status_code == 404


@pytest.mark.asyncio
async def test_delete_project(authenticated_client):
    response = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )

    project_id = response.json()["id"]

    deleted = await authenticated_client.delete(f"/projects/{project_id}")

    assert deleted.status_code == 204


@pytest.mark.asyncio
async def test_update_project(authenticated_client):
    response = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )

    project_id = response.json()["id"]

    response = await authenticated_client.put(
        f"/projects/{project_id}",
        json={"name": "newName", "description": "newDescription"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "newName"
    assert response.json()["description"] == "newDescription"
