from contextlib import asynccontextmanager
from fastapi import FastAPI
from .core.database import engine, Base
from .routes import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(auth.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
