from flask import request
from functools import wraps
from typing import Dict
from datetime import datetime, timedelta


class RateLimiter:
    """
    Simple in-memory rate limiter for write operations.
    
    Production alternatives:
    - Redis-backed rate limiting (distributed)
    - Flask-Limiter with proper storage backend
    - API Gateway rate limiting (AWS/Cloudflare)
    
    Current implementation tracks requests per IP with sliding window.
    """
    
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: Dict[str, list] = {}  # {ip: [timestamps]}
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed under rate limit.
        
        Args:
            identifier: Usually IP address, could be user_id in production
        
        Returns:
            True if request allowed, False if rate limited
        """
        now = datetime.utcnow()
        cutoff = now - timedelta(seconds=self.window_seconds)
        
        # Clean old requests
        if identifier in self._requests:
            self._requests[identifier] = [
                ts for ts in self._requests[identifier] if ts > cutoff
            ]
        else:
            self._requests[identifier] = []
        
        # Check limit
        if len(self._requests[identifier]) >= self.max_requests:
            return False
        
        # Record request
        self._requests[identifier].append(now)
        return True


# Global rate limiter instance
# In production: move to app factory and use Redis
rate_limiter = RateLimiter(max_requests=20, window_seconds=60)


def rate_limit(f):
    """
    Decorator for rate limiting endpoints.
    
    Usage:
        @app.route('/tasks', methods=['POST'])
        @rate_limit
        def create_task():
            ...
    
    TODO: In production, use Flask-Limiter with Redis backend
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        identifier = request.remote_addr or 'unknown'
        
        if not rate_limiter.is_allowed(identifier):
            return {
                'error': 'Rate limit exceeded',
                'message': 'Too many requests. Please try again later.'
            }, 429
        
        return f(*args, **kwargs)
    
    return decorated_function


def validate_task_input(data: dict) -> tuple[bool, str]:
    """
    Validate task creation/update input.
    
    Args:
        data: Request JSON body
    
    Returns:
        (is_valid, error_message)
    """
    if not data:
        return False, "Request body is required"
    
    if 'title' not in data:
        return False, "Title field is required"
    
    title = data.get('title', '').strip()
    if not title:
        return False, "Title cannot be empty"
    
    if len(title) > 500:
        return False, "Title too long (max 500 characters)"
    
    return True, ""