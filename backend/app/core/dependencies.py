from fastapi import Header

def verify_internal_api_key(x_internal_api_key: str = Header(...)):
    # We are accepting the header but doing no validation logic yet
    return x_internal_api_key