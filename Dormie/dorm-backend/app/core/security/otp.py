import random, time
from sqlalchemy.orm import Session
from ...models import user_model
from . import hashing
from fastapi import HTTPException, status

def get_otp(username_: str , db : Session):
    
    entry = db.query(user_model.Otp).filter(username_
                                            == user_model.Otp.username).first()
    
    if entry and time.time() - entry.last_sent_at < 60:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS,
                             detail=f"please wait {int(entry.last_sent_at - time.time()) + 60} seconds before requesing another otp")
    
    
    new_otp = str(random.randint(10000,99999))
    expiration_time_ = int(time.time()) + 300

    hashed_otp = hashing.bcrypt(new_otp)

    
    
    if not entry:
        new_entry = user_model.Otp(username = username_, otp_hash = hashed_otp,
                                   expiration_time = expiration_time_,last_sent_at = int(time.time()))
        
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)

    else:
        entry.otp_hash = hashed_otp
        entry.expiration_time = expiration_time_
        entry.last_sent_at = int(time.time())
        entry.attempt_count = 0
        entry.is_used = False
        db.commit()

    return new_otp

def verify_otp(username_: str , db : Session, otp_recieved: str):
    entry = db.query(user_model.Otp).filter(username_
                                            == user_model.Otp.username).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = 'User doesnt exist')


    if entry.attempt_count > 5:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many failed attempts,try again after sometime")


    if (hashing.verify(otp_recieved,entry.otp_hash) 
        and time.time() < entry.expiration_time 
        and entry.is_used==False):

        entry.is_used = True
        db.commit()
        return True

    else :        
        entry.attempt_count +=1
        db.commit()
        return False