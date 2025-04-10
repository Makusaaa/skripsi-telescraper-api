import fs from 'fs';
import { TelegramClient } from "telegram";
import { parseFile } from '../../api/helper/parsing.helper';
import { insertCredentials } from '../../api/helper/credentials.helper';
import { getChannelByNumber } from '../../api/helper/channels.helper';
import { insertFile } from '../../api/helper/files.helper';
import { filesModel } from '../../api/database/schema/files';

const downloadsDirectory = './.downloads';

export default {
    event: TelegramClient.events.NewMessage,
    execute: async function (event: any) {
        const { message } = event;
        const { peerId, id: messageNumber } = message;
        const { channelId: channelNumber, userId } = peerId
        const chatNumber = channelNumber?.toString() ?? userId.toString()
        
        console.log(`[NEW MESSAGE]: (From: ${chatNumber}) ${message.message}\n`)

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
                const newFile: filesModel = {
                    filename: fileName,
                    channelid: channel.channelid!,
                    messageid: messageNumber,
                }
                const file = await insertFile(newFile);
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