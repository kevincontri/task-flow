from fastapi import FastAPI
from .routes import auth, projects, tasks, comments

app = FastAPI(title="Taskflow", description="Taskflow API", version="1.0.0")
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(comments.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
