import fs from 'fs';
import { TelegramClient } from "telegram";
import { parseFile } from '../../services/parsingService';
import { getAllCredentials, insertCredentials } from '../../services/credentialService';

const downloadsDirectory = './.downloads';

export default {
    event: TelegramClient.events.NewMessage,
    execute: async function (event: any) {
        const { message } = event;
        const { peerId, id } = message;
        const { channelId, userId } = peerId
        const chatid = channelId?.toString() ?? userId.toString()
        if(message.media)
        {
            if (!fs.existsSync(downloadsDirectory))
                fs.mkdirSync(downloadsDirectory);
            const filePath = `${downloadsDirectory}/${chatid}-${id}-${message.media.document.attributes[0].fileName}`
            console.log(`downloading to ${filePath}`)
            await message.downloadMedia({
                outputFile: filePath
            })
            console.log(`downloading done`)
            console.log(`parsing ${filePath}`)
            const data = await parseFile("./.downloads/dummy.txt");
            console.log(`parsing done`)
            console.log(data)
            
            if(data){
                console.log(`inserting ${data.length} credentials`)
                await insertCredentials(data,chatid,id)
                console.log(`insert done`)
            }

            fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log(`${filePath} was deleted`);
            });
        }
    }
};