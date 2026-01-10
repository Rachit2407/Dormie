from passlib.context import CryptContext
import secrets, hashlib
import time

pwd_context = CryptContext(schemes=['bcrypt'], deprecated ='auto')


def bcrypt(password:str):
    return  pwd_context.hash(password)
    
def verify(plain_password,hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def generate_reset_token():
    raw = secrets.token_urlsafe(32)          # send this to user
    hashed = hashlib.sha256(raw.encode()).hexdigest()  # store this
    return raw, hashed

def verify_reset_token(raw_token, stored_hash, expires_at):
    if time.time() > expires_at:
        return False
    return hashlib.sha256(raw_token.encode()).hexdigest() == stored_hash