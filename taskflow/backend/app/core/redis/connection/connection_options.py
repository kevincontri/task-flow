from ...config import settings

connection_options = {
    "HOST": settings.REDIS_URL,
    "PORT": settings.REDIS_PORT,
    "DB": settings.REDIS_DB,
    "DECODE_RESPONSES": settings.REDIS_DECODE_RESPONSES,
}
