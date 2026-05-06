"""
Sliding-window rate limiter (in-process).
For multi-worker deployments swap _windows for a Redis sorted set.
"""

import time
from collections import defaultdict ,deque
from typing import Dict, List
from fastapi import HTTPException
from starlette import status

_windows: Dict[str, deque] = defaultdict(deque)


def check_rate_limit(user_id: str,feature:str, max_calls:int, window_seconds:int) -> None:
    key=f"{user_id}:{feature}"
    now=time.time()
    window=_windows[key]

    # Drop timestamps outside the sliding window
    while window and window[0] < now - window_seconds:
        window.popleft()

    if len(window) >= max_calls:
        retry_after = int(window[0] + window_seconds - now) +1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Retry in {retry_after}s.",
            headers={"Retry-After": str(retry_after)},
        )

    window.append(now)