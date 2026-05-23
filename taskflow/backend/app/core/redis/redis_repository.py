import redis.asyncio as redis
from typing import Any


class RedisRepository:
    def __init__(self, r: redis.Redis) -> None:
        self.r = r

    async def insert(self, key: str, value: Any) -> None:
        await self.r.set(key, value)

    async def get(self, key: str) -> Any:
        return await self.r.get(key)

    async def insert_hash(self, key: str, field: str, value: Any) -> None:
        await self.r.hset(key, field, value)

    async def get_hash(self, key: str, field: str) -> Any:
        return await self.r.hget(key, field)

    async def delete(self, key: str) -> None:
        await self.r.delete(key)

    async def insert_ex(self, key: str, value: Any, expire: int) -> None:
        await self.r.setex(key, expire, value)

    async def insert_hash_ex(
        self, key: str, field: str, value: Any, expire: int
    ) -> None:
        await self.r.hset(key, field, value)
        await self.r.expire(key, expire)
