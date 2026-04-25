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
