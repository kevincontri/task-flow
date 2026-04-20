from sqlalchemy.ext.asyncio import AsyncSession
from ..core.security import hash_password, verify_password, create_access_token
from ..repositories.user_repository import get_user_by_email, create_user
from ..schemas.user import UserCreate, TokenResponse
from ..models.user import User
from ..exceptions.exceptions import DuplicateError, InvalidCredentials


async def register(session: AsyncSession, user: UserCreate) -> User:
    if await get_user_by_email(session, user.email):
        raise DuplicateError("Email already registered")

    hashed_password = hash_password(user.password)
    db_user = await create_user(session, user, hashed_password)
    return db_user


async def login(session: AsyncSession, email: str, password: str) -> TokenResponse:
    user = await get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        raise InvalidCredentials("Invalid Credentials")

    access_token = create_access_token(user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")
