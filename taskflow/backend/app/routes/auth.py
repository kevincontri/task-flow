from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas.user import UserCreate, UserResponse, LoginRequest, TokenResponse
from ..services.auth_service import register, login
from ..core.database import get_db
from ..exceptions.exceptions import DuplicateError, InvalidCredentials

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, session: AsyncSession = Depends(get_db)):
    try:
        db_user = await register(session, user)
        return db_user
    except DuplicateError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse, status_code=200)
async def login_user(user: LoginRequest, session: AsyncSession = Depends(get_db)):
    try:
        return await login(session, user.email, user.password)
    except InvalidCredentials as e:
        raise HTTPException(status_code=401, detail=str(e))
