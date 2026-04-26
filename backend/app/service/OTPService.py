"""
OTP (One-Time Password) service for email verification
Generates 6-digit numeric codes for easier user verification
"""
import random
import redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class OTPService:
    def __init__(self):
        self.redis_client = redis.from_url(
            settings.Redis_URL(), 
            decode_responses=True
        )
    
    def generate_otp(self) -> str:
        """Generate a 6-digit OTP code"""
        return f"{random.randint(100000, 999999)}"
    
    def store_otp(self, user_id: int, otp: str, expiry_seconds: int = 600) -> bool:
        """Store OTP in Redis with expiry (default 10 minutes)"""
        try:
            key = f"otp:{user_id}"
            self.redis_client.setex(key, expiry_seconds, otp)
            logger.info(f"OTP stored for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to store OTP: {str(e)}")
            return False
    
    def verify_otp(self, user_id: int, otp: str) -> bool:
        """Verify OTP for a user"""
        try:
            key = f"otp:{user_id}"
            stored_otp = self.redis_client.get(key)
            
            if not stored_otp:
                logger.warning(f"No OTP found for user {user_id}")
                return False
            
            if stored_otp == otp:
                # Delete OTP after successful verification
                self.redis_client.delete(key)
                logger.info(f"OTP verified successfully for user {user_id}")
                return True
            else:
                logger.warning(f"Invalid OTP provided for user {user_id}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to verify OTP: {str(e)}")
            return False
    
    def get_user_id_by_otp(self, otp: str) -> int:
        """Get user ID by OTP (for token-based verification)"""
        try:
            # This is a reverse lookup - iterate through all OTP keys
            # In production, you might want to maintain an OTP->user_id mapping
            keys = self.redis_client.keys("otp:*")
            for key in keys:
                stored_otp = self.redis_client.get(key)
                if stored_otp == otp:
                    user_id = int(key.split(":")[1])
                    return user_id
            return None
        except Exception as e:
            logger.error(f"Failed to get user ID by OTP: {str(e)}")
            return None
