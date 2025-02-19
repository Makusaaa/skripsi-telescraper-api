import { TelegramClient } from "telegram";
import newMessageEvent from "./events/newMessage";

export function eventHandler(client: TelegramClient){
    client.addEventHandler(newMessageEvent.execute, new newMessageEvent.event());
}