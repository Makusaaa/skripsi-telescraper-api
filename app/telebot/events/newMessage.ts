import fs from 'fs';
import { TelegramClient } from "telegram";

const downloadsDirectory = './.downloads';

export default {
    event: TelegramClient.events.NewMessage,
    execute: async function (event: any) {
        let { message } = event;
        let { peerId, id } = message;
        let { channelId, userId } = peerId
        if(message.media)
        {
            if (!fs.existsSync(downloadsDirectory))
                fs.mkdirSync(downloadsDirectory);
            message.downloadMedia({
                outputFile: `./.downloads/${channelId ?? userId}-${id}-${message.media.document.attributes[0].fileName}`
            })
        }
    }
};