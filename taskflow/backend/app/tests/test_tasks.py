import pytest # type: ignore


@pytest.mark.asyncio
async def test_create_task(authenticated_client):
    project = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )
    project_id = project.json()["id"]

    response = await authenticated_client.post(
        f"/projects/{project_id}/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    assert response.status_code == 201
    assert response.json()["status"] == "todo"
    assert response.json()["priority"] == "medium"


@pytest.mark.asyncio
async def test_move_task(authenticated_client):
    project = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )
    project_id = project.json()["id"]

    task = await authenticated_client.post(
        f"/projects/{project_id}/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    task_id = task.json()["id"]

    response = await authenticated_client.patch(
        f"/projects/{project_id}/tasks/{task_id}/move",
        json={"status": "done"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "done"


@pytest.mark.asyncio
async def test_create_task_wrong(authenticated_client):
    task = await authenticated_client.post(
        f"/projects/999/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    assert task.status_code == 404


@pytest.mark.asyncio
async def test_update_task(authenticated_client):
    project = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )
    project_id = project.json()["id"]

    task = await authenticated_client.post(
        f"/projects/{project_id}/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    task_id = task.json()["id"]

    response = await authenticated_client.put(
        f"/projects/{project_id}/tasks/{task_id}",
        json={
            "name": "newName",
            "description": "newDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
            "priority": "high",
            "status": "done",
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "newName"
    assert response.json()["description"] == "newDescription"


@pytest.mark.asyncio
async def test_task_with_comments_delete(authenticated_client):
    project = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )
    project_id = project.json()["id"]

    task = await authenticated_client.post(
        f"/projects/{project_id}/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    task_id = task.json()["id"]

    comment_response = await authenticated_client.post(
        f"/projects/{project_id}/tasks/{task_id}/comments",
        json={"content": "exampleComment"},
    )

    comment_id = comment_response.json()["id"]

    task_delete_response = await authenticated_client.delete(
        f"/projects/{project_id}/tasks/{task_id}"
    )

    assert task_delete_response.status_code == 204

    comment_excluded = await authenticated_client.get(
        f"/projects/{project_id}/tasks/{task_id}/comments/{comment_id}"
    )

    assert comment_excluded.status_code == 404
