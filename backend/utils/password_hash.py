import bcrypt

def hash_user_password(password):
    """Encodes password and returns a salt-hashed version"""
    # Convert string to bytes
    pwd_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # Return as string for database storage
    return hashed_password.decode('utf-8')

def verify_user_password(stored_password, provided_password):
    """Compares provided password with the stored hash"""
    # Convert both to bytes for comparison
    pwd_bytes = provided_password.encode('utf-8')
    hashed_bytes = stored_password.encode('utf-8')
    # Check if they match
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)