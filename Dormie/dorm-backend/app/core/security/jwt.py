
from datetime import datetime, timedelta, timezone
from jose import jwt,exceptions
from ...schemas import user_schema
import os
from dotenv import load_dotenv

load_dotenv()

secret_key = os.getenv('SECRET_KEY')
algorithm = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

def verify_token(token:str, credentials_exception):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = user_schema.TokenData(username=username)
    except exceptions.InvalidTokenError:
        raise credentials_exception 
