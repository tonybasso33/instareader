import { Word } from "./word";

export class User {

    name: string;
    words: Array<Word>;
    totalMessages: number;

    constructor(name = '', words = [], totalMessages = 0){
        this.name = name;
        this.words = words;
        this.totalMessages = totalMessages;
    }

}
