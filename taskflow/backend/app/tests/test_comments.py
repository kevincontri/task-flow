async def test_create_and_get_comments(authenticated_client):
    response = await authenticated_client.post(
        "/projects",
        json={"name": "exampleName", "description": "exampleDescription"},
    )
    project_id = response.json()["id"]

    response = await authenticated_client.post(
        f"/projects/{project_id}/tasks",
        json={
            "name": "exampleName",
            "description": "exampleDescription",
            "deadline": "2023-01-01T00:00:00.000Z",
        },
    )
    task_id = response.json()["id"]

    response = await authenticated_client.post(
        f"/projects/{project_id}/tasks/{task_id}/comments",
        json={"content": "exampleComment"},
    )

    assert response.status_code == 201
    assert "id" in response.json()
    assert "created_at" in response.json()
    assert "author_id" in response.json()
    assert "task_id" in response.json()

    comments = await authenticated_client.get(
        f"/projects/{project_id}/tasks/{task_id}/comments"
    )
    assert "id" in comments.json()[0]
    assert "created_at" in comments.json()[0]
    assert "author_id" in comments.json()[0]
    assert "task_id" in comments.json()[0]


async def test_delete_comment_wrong(authenticated_client):
    response = await authenticated_client.delete("/projects/1/tasks/1/comments/999")
    assert response.status_code == 404
