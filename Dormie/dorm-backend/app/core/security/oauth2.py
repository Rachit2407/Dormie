from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from . import jwt
from jose import exceptions


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

oauth2_optional = OAuth2PasswordBearer(
    tokenUrl="/login",
    auto_error=False
)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    return jwt.verify_token(token,credentials_exception)

def get_optional_user(
    token: Annotated[str | None, Depends(oauth2_optional)]
):
    if not token:
        return None
    try:
        return jwt.verify_token(token, None)
    except Exception:
        return None