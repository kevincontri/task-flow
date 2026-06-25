# type: ignore
import redis.asyncio as redis
from ...config import settings


# Redis connection
class RedisConnectionHandler:
    def __init__(self) -> None:
        self.__url = settings.REDIS_URL
        self.__decode_responses = settings.REDIS_DECODE_RESPONSES
        self.__connection = None

    async def connect(self) -> None:
        try:
            self.__connection = redis.from_url(
                self.__url,
                decode_responses=self.__decode_responses,
            )

            await self.__connection.ping()
        except Exception as e:
            raise Exception(f"Redis connection error: {e}")

    async def get_conn(self) -> redis.Redis:
        return self.__connection