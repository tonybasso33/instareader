const fix = require("./encodeFix");
const fs = require("fs");
const utf8 = require("utf8");
const {User, Word} = require("./classes.js");
const jmerge = require("json-merger")
const badWords = require("french-badwords-list");
let data = [];
let msgCounter = 0;
let itemCounter = 0;
let words = ['jtm', 'je t\'aime', 'je t’aime', 'je taime','ptn', 'con', 'fdp', 'fils de pute', 'pute', 'couillon', 'couillonne', , 'tg', 'tgl', 'connard', 'connasse', 'salope', 'enculé', 'enculer', 'enculée',  'ta gueule', 'batard', 'enfoirée', 'enfoiré', 'enfoire', 'encule'];
let expressions = ['je t\'aime', 'je t’aime', 'je taime', 'ta gueule'];
//words = words.concat(badWords.array);

//merge multiple files
let fileNumber = 2;
let files = []
for(let i = 1;i<=fileNumber; i++)
{
    const f = require(`./data/message_${i}.json`)
    files.push(f);
}

let json = mergeJsons(files);


main();
function main()
{
    let { messages, participants } = JSON.parse(fix(JSON.stringify(json)));
    for (let index of Object.keys(participants)) 
    {
        p = participants[index];
        let user = new User(p.name, []);
        data.push(user);
    }
    
    for (let index of Object.keys(messages)) 
    {
        m = messages[index];
        if(m.content)
        {
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

            for(ex of expressions)
                if(message.includes(ex))
                    addCount(m.sender_name, ex);
                
            msgCounter++;
        }
        itemCounter++;
    }

    display();
}



function addCount(userName, wordName)
{
    let exists = false;
    let search = true;
    for(user of data)
    {
        if(user.name == userName)
        {
            while(exists == false && search == true)
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

                search = false;
            }
        }
    }

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

function makeFile(jsonContent)
{
    fs.writeFile("output.json", jsonContent.toString(), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
}

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
