export class Message{

    content: string;
    author: string;
    timestamp: number;

    constructor(content = '', author = '', timestamp = -1){
        this.content = content;
        this.author = author;
        this.timestamp = timestamp;
    }

    getFormattedTimestamp()
    {
        let date = new Date(this.timestamp);
        let finalDate = ('0' + date.getDate()).slice(-2) + '/'
                             + ('0' + (date.getMonth()+1)).slice(-2) + '/'
                             + date.getFullYear()
                             +" "
                             + date.getHours() + ":" + ('0' + (date.getMinutes()+1)).slice(-2);
        return finalDate;
    }
}
