class User {

    constructor(name, words, total){
        this.name = name;
        this.words = words;
        this.total = total
    }

}

class Word{
    constructor(name, count){
        this.name = name;
        this.count = count;
    }
}

module.exports = {
    User : User,
    Word : Word
}