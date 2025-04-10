import { TelegramClient } from "telegram";
import newMessageEvent from "./events/new-message";

export function eventHandler(client: TelegramClient){
    client.addEventHandler(newMessageEvent.execute, new newMessageEvent.event());
}