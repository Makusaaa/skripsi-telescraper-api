from fastapi import APIRouter, Depends
from ..lib.telethonClient import client
from typing import Union

router = APIRouter(
    prefix="/telebot",
)
@router.get("/")
async def read_users():
    return {"response": "hello this is the telegram bot's API"}

@router.get("/send")
async def read_user_me(
recipient: Union[str, None] = None,
message: Union[str, None] = None):
  await client.send_message(recipient,message)
  return {"username": "sent"}