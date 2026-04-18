from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse import stream_logs_endpoint

app = FastAPI(title="Iteron AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunLoopRequest(BaseModel):
    goal: str | None = None


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/run-loop")
async def run_loop(body: RunLoopRequest):
    return {"status": "ok"}


@app.get("/stream-logs")
async def stream_logs():
    return stream_logs_endpoint()


@app.post("/reset")
async def reset():
    return {"status": "ok"}
