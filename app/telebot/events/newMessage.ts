import fs from 'fs';
import { TelegramClient } from "telegram";
import { parseFile } from '../../services/parsingService';
import { insertCredentials } from '../../services/credentialService';
import { getChannelByNumber } from '../../services/channelsService';
import { insertFile } from '../../services/filesService';

const downloadsDirectory = './.downloads';

export default {
    event: TelegramClient.events.NewMessage,
    execute: async function (event: any) {
        const { message } = event;
        const { peerId, id: messageNumber } = message;
        const { channelId: channelNumber, userId } = peerId
        const chatNumber = channelNumber?.toString() ?? userId.toString()
        if(message.media)
        {
            const channel = await getChannelByNumber(chatNumber);
            if(!channel){
                console.log("chat room not registered");
                return;
            }
            if (!fs.existsSync(downloadsDirectory))
                fs.mkdirSync(downloadsDirectory);

            const fileName = message.media.document.attributes[0].fileName
            const filePath = `${downloadsDirectory}/${chatNumber}-${messageNumber}-${fileName}`
            
            await message.downloadMedia({
                outputFile: filePath
            })
            const data = await parseFile(filePath);
            
            if(data){
                const file = await insertFile(fileName, channel.channelid!, messageNumber);
                await insertCredentials(data, file.fileid)
            }

            // Delete file
            // fs.unlink(filePath, (err) => {
            //     if (err) throw err;
            //     console.log(`${filePath} was deleted`);
            // });
        }
    }
};