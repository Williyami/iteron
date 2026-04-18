import asyncio
from sse_starlette.sse import EventSourceResponse

_log_queue: asyncio.Queue = asyncio.Queue()


async def log_stream():
    """Yield queued log messages as SSE events."""
    while True:
        message = await _log_queue.get()
        yield {"data": message}


async def push_log(message: str) -> None:
    await _log_queue.put(message)


def stream_logs_endpoint():
    return EventSourceResponse(log_stream())
