from pydantic import BaseModel
from typing import List

class LoginDetails(BaseModel):
    username:str
    password:str
    name : str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class Login(BaseModel):
    username:str
    password:str

class GetUser(BaseModel):
    username:str

class GetOTP(BaseModel):
    username:str
    otp:str 

class ResetPassword(BaseModel):
    username: str 
    token:str 
    new_password:str               