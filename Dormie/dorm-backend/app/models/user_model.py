from ..core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

class LoginDetails(Base):
    __tablename__ = 'login_details'

    id = Column(Integer, primary_key=True, index = True)
    name = Column(String)
    password = Column(String)
    username = Column(String,  unique=True) # email id is the username
    is_verified = Column(Boolean, default= False)

class Otp(Base):
    __tablename__ = 'otp'  

    id = Column(Integer, primary_key=True, index = True) 
    username = Column(String,  unique=True, nullable=False, index= True) #email id is the username   
    otp_hash = Column(String, nullable= False) 
    expiration_time = Column(Integer, index= True) #time in seconds
    last_sent_at = Column(Integer) #time in seconds
    attempt_count = Column(Integer,default= 0)
    is_used = Column(Boolean, default= False)

class PasswordResetTokens(Base):
    __tablename__ = 'password reset tokens' 

    id = Column(Integer, primary_key=True, index = True) 
    username = Column(String,  unique=True, nullable=False, index= True) #email id is the username
    token_hash = Column(String, nullable= False) 
    expiration_time = Column(Integer, index= True) #time in seconds