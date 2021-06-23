import { Word } from "./word";
import { Message } from "./message";

export class User {

    name: string;
    words: Array<Word>;
    totalMessages: number;
    messages: Array<Message>;

    constructor(name = '', words = [], totalMessages = 0, messages = []){
        this.name = name;
        this.words = words;
        this.totalMessages = totalMessages;
        this.messages = messages;
    }

    getSortedWords(){
        return this.words.sort((a, b) => a.name.localeCompare(b.name))
    }

}
