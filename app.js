
//MADE BY TONY BASSO

//config file
const config = require("./config");

//dependencies
const fix = require("./util/encodeFix"); // took from (https://github.com/cbsuh/fix_fbjson) to fix facebook wrong encoding
const {User, Word} = require("./util/classes");
const fs = require("fs");

//filters
const {words, expressions}= require("./filters");
const badWords = require("./util/badWords");

/******** GLOBAL VARIABLES **********/ 
let data = [];          //final data that will be displayed
let msgCounter = 0;     //count messages
let itemCounter = 0;    //count every item (messages, images, audios)

//words = words.concat(badWords.array); //array that contains tons of french bad words (https://github.com/darwiin/french-badwords-list)


/******** FOR TEST PURPOSES **********/ 
let files = [];
fs.readdirSync(config.dataPath).forEach(fileName => {
    if(fs.lstatSync(config.dataPath+fileName).isFile())
    {
        let file = require(`${config.dataPath+fileName}`);
        files.push(file);
    }
});
    


let json = mergeJsons(files);
/************************************/ 


main();


function main()
{
    let { messages, participants } = JSON.parse(fix(JSON.stringify(json)));

    //add users
    for (let index of Object.keys(participants)) 
    {
        p = participants[index];
        let user = new User(p.name, []);
        data.push(user);
    }
    
    //count filters
    for (let index of Object.keys(messages)) 
    {
        m = messages[index];
        if(m.content)
        {

            //count words
            let message = m.content.toLowerCase();
            let mWords = message.split(' ');
            for(mWord of mWords)
            {
                for(w of words)
                {
                    if(mWord == w)
                    {
                        addCount(m.sender_name, w);
                    }
                }
            }

            //count expressions
            for(ex of expressions)
                if(message.includes(ex))
                    addCount(m.sender_name, ex);
                
            msgCounter++;
        }
        itemCounter++;
    }

    display();
}


/**
 * adds a count to a word for a user
 * 
 * @param {string} userName user concerned
 * @param {string} wordName word to count 
 */
function addCount(userName, wordName)
{
    let exists = false;

    //check if word has already been said by user 
    for(user of data)
    {
        if(user.name == userName)
        {
            for(word of user.words)
            {
                if(word.name == wordName)
                {
                    word.count++;
                    console.log(`${userName} + ${wordName}`)
                    exists = true;
                }
            }
        }
    }

    //add word to user list
    if(exists == false)
    {
        let newWord = new Word(wordName, 1);
        for(user of data)
        {
            if(user.name == userName)
            {
                user.words.push(newWord);
                console.log(`${userName} > ${wordName}`)
            }
        }
    }
}

/**
 * 
 * displays data in the console 
 * 
 */
function display()
{
    
    for(let user of data)
    {
        let total = 0;
        console.log("\n----------------");
        console.log(user.name);
        console.log("----------------");
        if(user.words.length > 0)
        {
            for(let word of user.words)
            {
                console.log(`${word.name}: ${word.count}`);
                total += word.count;
            }
        }
        console.log(`\nTotal: ${total}`);
        console.log("----------------");
    }
    console.log(`\n| Total messages: ${msgCounter}`);
    console.log(`| Total items: ${itemCounter}\n`);
}

/**
 * 
 * merge JSON files for future parsing
 * 
 * @param {Array} array contains multiple JSON
 * @returns single JSON
 */
function mergeJsons(array)
{
    let finalJson = {"participants": [], "messages": []};

    for(let json of array)
    {
        ///add participants
        for(p of json.participants)
        {
            if(finalJson[p] === 'undefined')
                finalJson.participants.push(p);
        }
        finalJson.participants = json.participants;

        //add messages
        for(m of json.messages)
        {
            finalJson.messages.push(m);
        }
    }

    return finalJson;
}
