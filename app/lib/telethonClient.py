import os
import datetime
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
  message = event.message
  messageid = message.id
  chatid = ""
  try:
    chatid = message.peer_id.channel_id
  except:
    chatid = message.peer_id.user_id

  if message.media:
    start = datetime.datetime.now()
    print('downloading...',)
    await message.download_media(file=f'./downloads/{chatid}-{messageid}-{message.media.document.attributes[0].file_name}')
    span = datetime.datetime.now() - start
    print(f'done in {span}')