import asyncpg

from app.config import settings


async def check_database() -> bool:
    if not all(
        [settings.postgres_user, settings.postgres_password, settings.postgres_db]
    ):
        return False

    connection = None

    try:
        connection = await asyncpg.connect(
            host=settings.postgres_host,
            port=settings.postgres_port,
            user=settings.postgres_user,
            password=settings.postgres_password,
            database=settings.postgres_db,
            timeout=3,
        )

        await connection.execute("SELECT 1")

    except (asyncpg.PostgresError, OSError, TimeoutError):
        return False
    else:
        return True

    finally:
        if connection is not None:
            await connection.close()
