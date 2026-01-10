from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import user_model
from ..schemas import user_schema
from ..core.security import hashing, jwt, oauth2
from ..core.security.otp import get_otp, verify_otp
from ..utils import email_otp
import time

router = APIRouter(tags=['Authentication'])

@router.post('/signup',status_code=status.HTTP_201_CREATED)
def signup(request: user_schema.LoginDetails,
           db : Session = Depends(get_db),
           user_check= Depends(oauth2.get_optional_user)):
    
    if user_check:
        raise HTTPException(
            status_code=400,
            detail="Already Signed in"
        )
    
    present = db.query(user_model.LoginDetails).filter(request.username ==
                                            user_model.LoginDetails.username).first()
    
    if present: raise HTTPException(status.HTTP_400_BAD_REQUEST
                              , detail='User alread exists')
    
    new_user = user_model.LoginDetails(name = request.name,
                                            username = request.username,
                                            password = hashing.bcrypt(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post('/send_otp',status_code=status.HTTP_201_CREATED)
def send_otp(request:user_schema.GetUser, db : Session = Depends(get_db)):
    
    present = db.query(user_model.LoginDetails).filter(request.username ==
                                            user_model.LoginDetails.username).first()
    
    if not present: raise HTTPException(status.HTTP_400_BAD_REQUEST
                              , detail='User does not exist, please signup first')

    if present.is_verified:
        raise HTTPException(status.HTTP_400_BAD_REQUEST
                              , detail='User is already verified, proceed to log in')

    otp = get_otp(request.username , db)

    response_code = email_otp.send_otp(request.username, otp)

    if response_code == 400:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid Email addresss")
    elif response_code == 201:
        return  {'Otp sent, valid for 5 minutes'}
    else:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, 
                            detail="Unable to send otp please try again after some time")

@router.post('/verify_email', status_code=status.HTTP_201_CREATED)
def verify(request: user_schema.GetOTP, db_ : Session = Depends(get_db),
           user_check= Depends(oauth2.get_optional_user)):
    
    if user_check:
        raise HTTPException(
            status_code=400,
            detail="Already Signed in"
        )
    
    verified = verify_otp(request.username, db_, request.otp)

    if verified: 
        user = db_.query(user_model.LoginDetails).filter(user_model.LoginDetails.username 
                                                         == request.username).first()
        user.is_verified = True
        db_.commit()
        
        return{'Otp is valid, User is now verified'}

    else: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid Otp') 

@router.post('/login',status_code=status.HTTP_201_CREATED)  
def login(request : OAuth2PasswordRequestForm = Depends(), db : Session= Depends(get_db), 
          user= Depends(oauth2.get_optional_user)):
    
    if user:
        raise HTTPException(
            status_code=400,
            detail="Already logged in"
        )
    entry = db.query(user_model.LoginDetails).filter(user_model.LoginDetails.username
                                                      == request.username).first()

    if not entry or not hashing.verify(request.password, entry.password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                             detail='Incorrect Credentials')
    
    if not entry.is_verified:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,'The user is not verified')
    
    access_token = jwt.create_access_token(data={'sub': entry.username})

    return {'access_token': access_token, 'token_type': 'bearer'}

@router.post('/forgot_password',status_code=status.HTTP_201_CREATED)  
def forgot_password(request: user_schema.GetUser, db : Session = Depends(get_db)):

    user = db.query(user_model.LoginDetails).filter(user_model.LoginDetails.username
                                                     == request.username).first()

    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST,
                             detail='User does not exist, please sign up')
    
    otp = get_otp(request.username , db)

    response_code = email_otp.send_otp(request.username, otp)

    if response_code == 400:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid Email addresss")
    elif response_code == 201:
        return  {'Otp sent, valid for 5 minutes'}
    else:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, 
                            detail="Unable to send otp please try again after some time")

@router.post('/reset_password_verify_email',status_code=status.HTTP_201_CREATED)  
def reset_password(request: user_schema.GetOTP, db : Session = Depends(get_db)):
    
    verified = verify_otp(request.username, db, request.otp)
    
    if verified:
        print('verified') 
        raw,hashed = hashing.generate_reset_token()

        user = db.query(user_model.PasswordResetTokens).filter(user_model.PasswordResetTokens.username
                                                                == request.username).first()
        if user:
            user.token_hash = hashed
            user.expiration_time = int(time.time()) + 900
            db.commit()
        
        else:
            new_user= user_model.PasswordResetTokens(username = request.username,token_hash = hashed,
                                                     expiration_time = int(time.time()) + 900 )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

        return{'detail':'Otp is valid','reset_token':raw}

    else: raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid Otp') 

@router.post('/reset_password',status_code=status.HTTP_201_CREATED)  
def reset_password(request: user_schema.ResetPassword ,db : Session = Depends(get_db)):
    
    user = db.query(user_model.PasswordResetTokens).filter(user_model.PasswordResetTokens.username
                                                                == request.username).first()
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='User dont exist')

    token_correct = hashing.verify_reset_token(raw_token=request.token,
                                                  stored_hash=user.token_hash,
                                                  expires_at=user.expiration_time)
    
    if token_correct:
        db.query(user_model.PasswordResetTokens).filter(user_model.PasswordResetTokens.username
                                                                == request.username).delete(synchronize_session=False)
        db.commit()
        
        db.query(user_model.LoginDetails).filter(user_model.LoginDetails.username 
                                                        == request.username).first().password = hashing.bcrypt(request.new_password)
        db.commit()

        return {'The password was changed'}
    
    else:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail='no')