# type: ignore
import redis.asyncio as redis
from .connection_options import connection_options


# Redis connection
class RedisConnectionHandler:
    def __init__(self) -> None:
        self.__host = connection_options["HOST"]
        self.__port = connection_options["PORT"]
        self.__db = connection_options["DB"]
        self.__decode_responses = connection_options["DECODE_RESPONSES"]
        self.__connection = None

    async def connect(self) -> None:
        try:
            self.__connection = redis.Redis(
                host=self.__host,
                port=self.__port,
                db=self.__db,
                decode_responses=self.__decode_responses,
            )

            await self.__connection.ping()
        except Exception as e:
            raise Exception(f"Redis connection error: {e}")

    async def get_conn(self) -> redis.Redis:
        return self.__connection
