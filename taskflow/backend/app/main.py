from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .routes import auth, projects, tasks, comments
from fastapi.middleware.cors import CORSMiddleware
from .exceptions.exceptions import *
from .core.database import AsyncSessionLocal
from sqlalchemy import select

app = FastAPI(title="Taskflow", description="Taskflow API", version="1.0.0")

# CORS configs to allow requests from localhost
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost(:\d+)?|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(comments.router)


@app.get("/health")
async def health():
    try:
        async with AsyncSessionLocal() as session:
            # Checks database connection with a simple query
            await session.execute(select(1))
            return {"status": "ok"}
    except Exception:
        return JSONResponse(status_code=503, content={"status": "db_unavailable"})


@app.exception_handler(NotFoundError)
async def not_found_error_handler(req, exc):
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(DatabaseError)
async def database_error_handler(req, exc):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


@app.exception_handler(InvalidCredentials)
async def invalid_credentials_error_handler(req, exc):
    return JSONResponse(status_code=401, content={"detail": str(exc)})


@app.exception_handler(ForbiddenAccess)
async def forbidden_error_handler(req, exc):
    return JSONResponse(status_code=403, content={"detail": str(exc)})


@app.exception_handler(DuplicateError)
async def duplicate_error_handler(req, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})
