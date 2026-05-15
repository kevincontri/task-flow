from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.user import UserCreate, UserResponse, LoginRequest, TokenResponse
from ..services.auth_service import register, login
from ..core.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, session: AsyncSession = Depends(get_db)):
    return await register(session, user)


@router.post("/login", response_model=TokenResponse, status_code=200)
async def login_user(user: LoginRequest, session: AsyncSession = Depends(get_db)):
    return await login(session, user.email, user.password)
