import enum

class UserRole(str ,enum.Enum):
    ADMIN = "admin"
    USER = "user"

class AuthProvider(str, enum.Enum):
    EMAIL = "email"
    GOOGLE = "google"
    FACEBOOK = "facebook"
    GITHUB = "github"


