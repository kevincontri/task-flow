import { delay, http, HttpResponse } from "msw";
import { LoginRequest, TokenResponse, RegisterRequest, UserBase } from "../types/auth_types";
import { ProjectBase } from "../types/project_types";
import { TaskBase } from "../types/task_types";


export const handlers = [
  // Mock for login endpoint
  http.post<any, LoginRequest, TokenResponse>("*/auth/login", async () => {
    await delay(3000); // Simulate network delay
    return HttpResponse.json({
      access_token: "FAKE_TOKEN",
      token_type: "bearer"
    }, { status: 200 });
  }),

  // Mock for register endpoint
  http.post<any, RegisterRequest, UserBase>("*/auth/register", async ({ request }) => {
    await delay(3000); // Simulate network delay
    const { email, username, password } = await request.json();
    return HttpResponse.json({
      id: 1,
      email,
      username,
      password,
      created_at: new Date().toISOString()
    }, { status: 201 });
  }),

  // Mock to fetch all projects 
  http.get<any, never, ProjectBase[]>("*/projects", async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Project 1",
        description: "Description 1",
        created_at: new Date().toISOString(),
        owner_id: 1
      },
      {
        id: 2,
        name: "Project 2",
        description: "Description 2",
        created_at: new Date().toISOString(),
        owner_id: 2
      },
    ], { status: 200 });
  }),

  // Mock to fetch project's tasks
  http.get<any, never, TaskBase[]>("*/projects/:projectId/tasks", async ({ params }) => {
    const { projectId } = params;
    return HttpResponse.json([
      {
        id: 1,
        name: "Task 1",
        description: "Description 1",
        status: "todo",
        priority: "low",
        deadline: new Date().toISOString(),
        project_id: Number(projectId),
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Task 2",
        description: "Description 2",
        status: "in_progress",
        priority: "medium",
        deadline: new Date().toISOString(),
        project_id: Number(projectId),
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: "Task 3",
        description: "Description 3",
        status: "done",
        priority: "high", 
        deadline: new Date().toISOString(),
        project_id: Number(projectId),  
        created_at: new Date().toISOString()
      },
    ], { status: 200 });
  }),

  // Mock to fetch a task's comments
  http.get("*/projects/:projectId/tasks/:taskId/comments", async () => {
    return HttpResponse.json([], { status: 200 });
  }),

  // Mock to create a comment
  http.post("*/projects/:projectId/tasks/:taskId/comments", async ({ params, request }) => {
    const taskId: number = Number(params.taskId);
    const body = await request.json() as { content: string };
    return HttpResponse.json({
      id: 1,
      content: body.content,
      author_id: 1,
      task_id: taskId,
      created_at: new Date().toISOString()
    }, { status: 201 });
  }),

  // Mock to delete a comment
  http.delete("*/projects/:projectId/tasks/:taskId/comments/:commentId", async () => {
    return HttpResponse.json({}, { status: 204 });
  }),

  // Mock to create a project
  http.post<any, { name: string; description: string }, ProjectBase>("*/projects", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 4,
      name: body.name,
      description: body.description,
      created_at: new Date().toISOString(),
      owner_id: 1
    }, { status: 201 });
  }),
];