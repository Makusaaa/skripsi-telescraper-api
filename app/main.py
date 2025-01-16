from fastapi import FastAPI
from .routers import telebot
from contextlib import asynccontextmanager
from .lib.telethonClient import client
import asyncio
from dotenv import load_dotenv
import os
load_dotenv()
loop = asyncio.get_event_loop()

@asynccontextmanager
async def lifespan(app: FastAPI):
  await client.start(phone=os.environ.get('PHONE'))
  asyncio.create_task(client.run_until_disconnected())
  yield
  client.disconnect()
app = FastAPI(lifespan=lifespan)

app.include_router(telebot.router)

@app.get("/")
async def root():
    return "telebot skripsi 1.0"