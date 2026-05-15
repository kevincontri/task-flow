from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from .config import settings
from .database import get_db
from ..repositories.user_repository import get_user_by_id
from ..models.user import User
from ..repositories.project_repository import get_project_by_id_repo

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    session: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user = await get_user_by_id(session, int(user_id))
        if user is None:
            raise credentials_exception
        return user
    except (JWTError, ValueError, TypeError):
        raise credentials_exception


async def get_owned_project(
    project_id: int,
    session: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    project = await get_project_by_id_repo(session, project_id, user.id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

