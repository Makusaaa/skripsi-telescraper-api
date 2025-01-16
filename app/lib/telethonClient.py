import os
from dotenv import load_dotenv
from telethon import TelegramClient, events
load_dotenv()

client = TelegramClient(
  'bot',
  os.environ.get('API_ID'),
  os.environ.get('API_HASH'),
)
@client.on(events.NewMessage)
async def new_message_listener(event):
  print(f"New message received: {event.text}")