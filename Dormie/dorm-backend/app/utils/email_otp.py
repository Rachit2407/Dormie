html = '''
        <html>
                <body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
                <div style="max-width:420px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
                <p style="color:#555;">
                Use the following One-Time Password to continue:
                </p>
                <div style="font-size:28px; font-weight:bold; letter-spacing:6px; margin:20px 0; color:#000;">
                {{OTP}}
                </div>

                <p style="color:#777; font-size:14px;">
                This OTP is valid for <b>5 minutes</b>.  
                Do not share it with anyone.
                </p>

                <p style="color:#999; font-size:12px;">
                If you didn’t request this, please ignore this email.
                </p>
                </div>
                </body>
                </html>'''

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('EMAIL_API_KEY')
url = os.getenv('EMAIL_URL')


def send_otp(recipient:str,otp:str):
        
        payload = {
                "sender": {"email": "priyanshusaini124@gmail.com", "name": "Dormie - no reply"},
                "to": [{"email": recipient}],
                "subject": "Your OTP Code",
                "htmlContent": html.replace("{{OTP}}", otp)
        }

        headers = {
                "api-key": API_KEY,
                "accept": "application/json",
                "content-type": "application/json"
        }

        response = requests.post(url, headers=headers, json=payload)

        print(response.status_code, response.text)

        return response.status_code