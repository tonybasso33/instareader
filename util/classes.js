class User {

    constructor(name, words){
        this.name = name;
        this.words = words;
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