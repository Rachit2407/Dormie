from fastapi import FastAPI, Depends
from .routers import auth
from .models import user_model
from .core.database import engine
from .schemas import user_schema
from.core.security import oauth2
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000", # The address of your Next.js app
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,  # CORS =  Cross Origin Resource Sharing
    allow_origins=origins,
    allow_credentials=True, # Allow cookies/headers
    allow_methods=["*"],    # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],    # Allow all headers (Authorization, Content-Type)
)

user_model.Base.metadata.create_all(bind=engine)

@app.get('/')
def root(current_user: user_schema.Login = Depends(oauth2.get_current_user)):
    return {'HEllO': 'WORLD'}

app.include_router(auth.router)