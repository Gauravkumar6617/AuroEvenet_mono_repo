"""
Email service for sending verification emails
Supports both real SMTP sending and development mode simulation
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings
from app.service.OTPService import OTPService
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.email_from = settings.EMAIL_FROM
        self.email_from_name = settings.EMAIL_FROM_NAME
        self.otp_service = OTPService()

    def send_verification_email(self, to_email: str, verification_token: str) -> bool:
        """
        Send email verification email
        Returns True if sent successfully, False otherwise
        """
        try:
            # Create verification URL (you'll need to configure your frontend URL)
            verification_url = f"http://localhost:8000/api/v1/auth/verify?token={verification_token}"
            
            # Email content
            subject = "Verify your BlogByte account"
            
            html_content = f"""
            <html>
            <body>
                <h2>Welcome to BlogByte!</h2>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <p><a href="{verification_url}">Verify Email Address</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p>{verification_url}</p>
                <p>This link will expire in 1 hour.</p>
                <br>
                <p>Best regards,<br>The BlogByte Team</p>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to BlogByte!
            
            Thank you for registering. Please visit the link below to verify your email address:
            
            {verification_url}
            
            This link will expire in 1 hour.
            
            Best regards,
            The BlogByte Team
            """
            
            # Try to send real email if SMTP is configured
            if self.smtp_host and self.smtp_host != "localhost" and self.smtp_username and self.smtp_password:
                return self._send_real_email(to_email, subject, text_content, html_content)
            else:
                # Development mode - simulate email sending
                return self._simulate_email(to_email, subject, text_content, html_content, verification_token)
                
        except Exception as e:
            logger.error(f"Failed to send verification email to {to_email}: {str(e)}")
            return False

    def _send_real_email(self, to_email: str, subject: str, text_content: str, html_content: str) -> bool:
        """Send email using real SMTP server"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.email_from_name} <{self.email_from}>"
            msg['To'] = to_email
            
            # Attach both plain text and HTML versions
            msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.smtp_username and self.smtp_password:
                    server.starttls()
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Verification email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send real email: {str(e)}")
            return False

    def _simulate_email(self, to_email: str, subject: str, text_content: str, html_content: str, verification_token: str) -> bool:
        """Simulate email sending in development mode"""
        print("\n" + "="*60)
        print("📧 EMAIL SIMULATION (Development Mode)")
        print("="*60)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"From: {self.email_from_name} <{self.email_from}>")
        print("-"*60)
        print(text_content)
        print("-"*60)
        print(f"🔗 Verification Token: {verification_token}")
        print(f"🔗 Verification URL: http://localhost:8000/api/v1/auth/verify?token={verification_token}")
        print("="*60)
        print("📧 NOTE: In production, configure SMTP settings to send real emails")
        print("="*60 + "\n")
        
        logger.info(f"Email simulation completed for {to_email}")
        return True

    def send_otp_email(self, to_email: str, user_id: int) -> Optional[str]:
        """
        Send OTP verification email
        Returns OTP code if sent successfully, None otherwise
        """
        try:
            # Generate OTP
            otp = self.otp_service.generate_otp()
            
            # Store OTP in Redis
            if not self.otp_service.store_otp(user_id, otp):
                return None
            
            # Email content
            subject = "Verify your BlogByte account - OTP Code"
            
            html_content = f"""
            <html>
            <body>
                <h2>Welcome to BlogByte!</h2>
                <p>Your verification code is:</p>
                <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px;">
                    {otp}
                </h1>
                <p>This code will expire in 10 minutes.</p>
                <p>Enter this code on the verification page to activate your account.</p>
                <br>
                <p>Best regards,<br>The BlogByte Team</p>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to BlogByte!
            
            Your verification code is: {otp}
            
            This code will expire in 10 minutes.
            Enter this code on the verification page to activate your account.
            
            Best regards,
            The BlogByte Team
            """
            
            # Try to send real email if SMTP is configured
            if self.smtp_host and self.smtp_host != "localhost" and self.smtp_username and self.smtp_password:
                success = self._send_real_email(to_email, subject, text_content, html_content)
                return otp if success else None
            else:
                # Development mode - simulate email sending
                self._simulate_otp_email(to_email, subject, text_content, html_content, otp)
                return otp
                
        except Exception as e:
            logger.error(f"Failed to send OTP email to {to_email}: {str(e)}")
            return None

    def _simulate_otp_email(self, to_email: str, subject: str, text_content: str, html_content: str, otp: str):
        """Simulate OTP email sending in development mode"""
        print("\n" + "="*60)
        print("📧 OTP EMAIL SIMULATION (Development Mode)")
        print("="*60)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"From: {self.email_from_name} <{self.email_from}>")
        print("-"*60)
        print(text_content)
        print("-"*60)
        print(f"🔢 OTP Code: {otp}")
        print("="*60)
        print("📧 NOTE: In production, configure SMTP settings to send real emails")
        print("="*60 + "\n")
        
        logger.info(f"OTP email simulation completed for {to_email}")
