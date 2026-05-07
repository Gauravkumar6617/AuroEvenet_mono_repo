import json
import logging
from typing import Any

import redis

from app.core.config import settings


logger = logging.getLogger(__name__)

redis_cache = redis.from_url(settings.Redis_URL, decode_responses=True)


def cache_get_json(key: str) -> Any | None:
    try:
        value = redis_cache.get(key)
        if value is None:
            return None
        return json.loads(value)
    except Exception as exc:
        logger.warning("Redis cache read failed for %s: %s", key, exc)
        return None


def cache_set_json(key: str, value: Any, ttl_seconds: int) -> None:
    try:
        redis_cache.setex(key, ttl_seconds, json.dumps(value))
    except Exception as exc:
        logger.warning("Redis cache write failed for %s: %s", key, exc)


def cache_delete(*keys: str) -> None:
    if not keys:
        return

    try:
        redis_cache.delete(*keys)
    except Exception as exc:
        logger.warning("Redis cache delete failed for %s: %s", keys, exc)


def cache_delete_pattern(pattern: str) -> None:
    try:
        keys = list(redis_cache.scan_iter(match=pattern, count=100))
        if keys:
            redis_cache.delete(*keys)
    except Exception as exc:
        logger.warning("Redis cache pattern delete failed for %s: %s", pattern, exc)
