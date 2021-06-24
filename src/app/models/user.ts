import { Word } from "./word";
import { Message } from "./message";

export class User {

    name: string;
    words: Array<Word>;
    messages: Array<Message>;

    constructor(name = '', words = [], messages = []){
        this.name = name;
        this.words = words;
        this.messages = messages;
    }

    getSortedWords(){
        return this.words.sort((a, b) => a.name.localeCompare(b.name))
    }

    getTotalMessages()
    {
        return this.messages.length;
    }

}
