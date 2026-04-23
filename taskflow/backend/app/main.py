from fastapi import FastAPI
from .routes import auth, projects, tasks

app = FastAPI()
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
