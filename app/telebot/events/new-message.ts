import fs from 'fs';
import { TelegramClient } from "telegram";
import { parseFile } from '../helper/parsing.helper';
import * as CredentialsHelper from '../../api/helper/credentials.helper';
import * as ChannelsHelper from '../../api/helper/channels.helper';
import * as AlarmsHelper from '../../api/helper/alarms.helper';
import * as KeywordsHelper from '../../api/helper/keywords.helper';
import * as CredentialExposureHelper from '../../api/helper/credentialexposure.helper';
import * as FilesHelper from '../../api/helper/files.helper';
import { filesModel } from '../../api/database/schema/files';
import { db } from '../../api/database/client';
import { credentialsModel } from '../../api/database/schema/credentials';
import { alarmsModel } from '../../api/database/schema/alarms';
import { credentialexposureModel } from '../../api/database/schema/credentialexposure';

const downloadsDirectory = './.downloads';

export default {
    event: TelegramClient.events.NewMessage,
    execute: async function (event: any) {
        try
        {
            const { message } = event;
            const { peerId, id: messageNumber } = message;
            const { channelId: channelNumber, userId } = peerId;
            const chatNumber = channelNumber?.toString() ?? userId.toString();

            if(message.media)
            {
                const channelCheck = await ChannelsHelper.getChannelByNumber(db, chatNumber);
                if(!channelCheck) {
                    console.log("chat room is not registered");
                    return;
                }
                console.log(`[NEW MESSAGE]: (From: ${chatNumber}) ${message.message}\n`)
                
                if (!fs.existsSync(downloadsDirectory))
                    fs.mkdirSync(downloadsDirectory);
                
                const fileName = message.media.document.attributes[0].fileName
                const filePath = `${downloadsDirectory}/${chatNumber}-${messageNumber}-${fileName}`
                
                await message.downloadMedia({
                    outputFile: filePath
                })
                const data = await parseFile(filePath);
                
                if(data){
                    // Insert File Data
                    const newFile: filesModel = {
                        filename: fileName,
                        channelid: channelCheck.channelid!,
                        messageid: messageNumber,
                    }
                    const insertedFile = await FilesHelper.insertFile(db, newFile);

                    // Get Keywords
                    const keywords: any[] = await KeywordsHelper.getKeywordList(db);

                    // Insert Credentials per chunk
                    let exposedCredentials: { [key: string]: credentialsModel[] } = {};
                    const chunkSize = 10000;
                    for (let i = 0; i < data.length; i += chunkSize) {
                        const chunk = data.slice(i, i + chunkSize);
                        const insertedChunk = await CredentialsHelper.insertCredentials(db, chunk, insertedFile.fileid)
                        insertedChunk.map((c) => {
                            return keywords.map((k) => {
                                if(c.login.includes(k.keyword) || (c.url && c.url.includes(k.keyword))) {
                                    if(!exposedCredentials[k.companyid]){
                                        exposedCredentials[k.companyid] = []
                                    }
                                    if(!exposedCredentials[k.companyid].includes(c)){
                                        exposedCredentials[k.companyid].push(c)
                                    }
                                }
                            })
                        })
                    }
                    for (const companyid in exposedCredentials) {
                        const users = exposedCredentials[companyid];
                        const newAlarm = await AlarmsHelper.insertAlarm(db,{
                            filename: insertedFile.filename,
                            channelname: channelCheck.channelname,
                            channeluserid: channelCheck.channeluserid,
                            companyid: Number(companyid),
                            status: false,
                            assignto: null,
                        } as alarmsModel)

                        const newExposedCredentials = users.map((e) => ({
                            alarmid: newAlarm.alarmid,
                            status: false,
                            url: e.url,
                            login: e.login,
                            password: e.password,
                        } as credentialexposureModel))

                        for (let i = 0; i < newExposedCredentials.length; i += chunkSize) {
                            const chunk = newExposedCredentials.slice(i, i + chunkSize);
                            await CredentialExposureHelper.insertExposedCredentials(db, chunk);
                        }
                    }

                }
                
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`${filePath} was deleted`);
                });
            }

        }
        catch(e)
        {
            console.error("[ERROR]:",e)
        }
    }
};