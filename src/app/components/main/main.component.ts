import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Word } from 'src/app/models/word';
import * as globals from '../../../globals';
import fix from '../../../assets/js/encodeFix';
import { TranslationService } from '../../services/translation.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Message } from 'src/app/models/message';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

    isMobile = false;
    
    alertTimeout = 0 as any;
    displayAlert = false;
    alerts = "";

    text = [] as any;
    subscription: any;

    results = [] as any;
    
    uploaded = false;
    jsonFiles = [] as any;
    finalJson = [] as any;

    filtersInput = "";
    
    filters= [] as string[];
    words = [] as string[];
    expressions = [] as string[];
    
    itemCounter = 0;

    messages = Array<Message>();

    constructor(private language: TranslationService, private deviceService: DeviceDetectorService) {
        this.isMobile = this.deviceService.isMobile();
        this.setLanguage(globals.language);
     }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe;
    } 

    setLanguage(lang: string)
    {
        this.language.setLanguage(lang);
        this.subscription = this.language.getTexts(lang).subscribe(newText => {
              this.text = newText;
              this.alerts = this.text["alert_json"];
          });
    }

    setFilters() {
        try{

            let fInput = this.filtersInput.toLowerCase().split(";");

            for (let filter of fInput) {
                let f = filter.split(" ");
                f = f.filter(function (e: any) { return e != "";});

                    if (f.length > 1) 
                    {
                        if(!this.expressions.includes(filter))
                        {
                            this.expressions.push(filter);
                            this.filters.push(filter);
                        }
                    }
                    else
                    {
                        filter = f[0];
                        if(filter.charAt(0) == " ")
                            filter = filter.slice(0, 0); //remove space if present

                        if(!this.words.includes(filter))
                        {
                            this.filters.push(filter);
                            this.words.push(filter);
                        }
                    }

            }
        }catch(e)
        {
            this.displayAlertMessage(this.text["alert_filters"]);
        }
    }

    sortFiltersObject(filters: any) {
        return filters.sort(function (a: Word, b: Word) {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    sortFiltersArray(filters: any) {
        return filters.sort((a: any, b: any) => a.localeCompare(b));
    }

    reset()
    {
        this.displayAlert = false;
        this.results = [];
        this.filters = [];
        this.words = [];
        this.expressions = [];
        this.itemCounter = 0;
        document.getElementById("results")!.style.display = 'none';
    }

    doParsing() 
    {
        const regex = /(^|\s+)word(?=\s+|$)/g;
        this.reset();
        this.setFilters()
        if(this.jsonFiles.length > 0 && this.filters.length > 0)
        {
            console.log("> Starting parsing...");
            let { messages, participants } = JSON.parse(fix(JSON.stringify(this.finalJson)));

            //add users
            for (let index of Object.keys(participants)) {
                let p = participants[index];
                let user = new User(p.name, [], 0);
                this.results.push(user);
            }

            //count filters
            for (let index of Object.keys(messages)) {
                let m = messages[index];
                if (m.content) {
                    console.log(m.content);

                    //register message
                    let userMessage = new Message(m.content, m.sender_name, m.timestamp_ms);
                    this.messages.push(userMessage);    

                    for(let user of this.results)
                    {
                        if(user.name == m.sender_name)
                        {
                            user.messages.push(userMessage);
                        }
                    }

                    //count words
                    let message = m.content.toLowerCase();
                    let mWords = message.split(' ');
                    mWords = mWords.filter(function (e: any) { return e != "";});

                    for (let w of this.words) {
                        for (let mWord of mWords) {
                            if (mWord == w) {
                                this.addCount(m.sender_name, w);
                            }
                        }
                    }

                    //count expressions
                    for (let ex of this.expressions)
                    {
                        if (message.includes(ex))
                        this.addCount(m.sender_name, ex);
                    }
                        
                    for (let user of this.results) {
                        if (user.name == m.sender_name)
                            user.total++;
                    }
                }
                this.itemCounter++;
            }


            this.messages = this.messages.sort((a, b) => {
                if(a.timestamp>b.timestamp) 
                    return 1
                else
                    return -1
            });
            this.addZeros();
            this.display();
            
        }
        else if(this.filters.length < 1)
        {
            this.displayAlertMessage(this.text["alert_filters"]);
        }
        else
        {
            this.displayAlertMessage(this.text["alert_json"]);
        }
    }

    hideWarningMessage()
    {
        this.isMobile = false;
    }

    hideAlertMessage()
    {
        if(this.alertTimeout)
        {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }
        this.displayAlert = false;

    }

    displayAlertMessage(message: string)
    {
        this.alerts = message;
        this.displayAlert = true;
        if(this.alertTimeout)
        {
            clearTimeout(this.alertTimeout);
            this.alertTimeout = null;
        }
        this.alertTimeout = setTimeout(()=>{ this.displayAlert = false }, 10000)
    }
    /**
     * 
     * displays results in the console 
     * 
     */
    display() {
        let totalMessages = 0.
        for (let user of this.results) {
            let total = 0;
            console.log("\n----------------");
            console.log(user.name);
            console.log("----------------");
            if (user.words.length > 0) {
                for (let word of user.words) {
                    console.log(`${word.name}: ${word.count}`);
                    total += word.count;
                }
            }

            totalMessages += user.total;
            console.log(`\nTotal words found: ${total}`);
            console.log(`Total messages: ${user.total}`);
            console.log("----------------");
        }

        console.log(`\n| Total messages: ${totalMessages}`);
        console.log(`| Total items: ${this.itemCounter}\n`);
        this.uploaded = true;

        document.getElementById("results")!.style.display = 'block';

        this.scrollToResults();

    }

    scrollToResults() {
        let e = document.getElementById("results")!;
        e.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }


    /**
     * adds a count to a word for a user
     * 
     * @param {string} userName user concerned
     * @param {string} wordName word to count 
     */
    addCount(userName: string, wordName: string) {
        let exists = false;

        //check if word has already been said by user 
        for (let user of this.results) {
            if (user.name == userName) {
                for (let word of user.words) {
                    if (word.name == wordName) {
                        user.total++; //add count to total words
                        word.count++;
                        console.log(`${userName} + ${wordName}`)
                        exists = true;
                    }
                }
            }

        }

        //add word to user list
        if (exists == false) {
            let newWord = new Word(wordName, 1);

            for (let user of this.results) {
                if (user.name == userName) {
                    user.total++; //add count to total words
                    user.words.push(newWord);
                    console.log(`${userName} > ${wordName}`)
                }
            }
        }
    }

    addZeros() {
        for (let user of this.results) {
            for (let filter of this.filters) {
                let check = user.words.find((word: Word) => word.name === filter);
                if (typeof check === 'undefined') {
                    let w = new Word(filter, 0);
                    user.words.push(w);
                }

            }
        }
    }

    setJson(event: any) {
        try
        {        
            this.jsonFiles = [];
            this.reset();
            let files = event.target.files;
            
            let promises = [];
            for (let file of files) {
                let filePromise = new Promise(resolve => {
                    let reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = () => resolve(reader.result);
                }).catch(() => this.displayAlertMessage(this.text["alert_json"]));
                promises.push(filePromise);
            }
            Promise.all(promises).then((contents) => {
                for(let c of contents)
                {
                    this.jsonFiles.push(JSON.parse(c as any))
                }
                this.mergeJsons();
            }).catch((error) =>
            {
                this.displayAlertMessage(this.text["alert_json"])
            });
        }
        catch (exception){
            this.displayAlertMessage(this.text["alert_json"]);

        }
    }

    mergeJsons()
    {
        this.finalJson = {"participants": [], "messages": []} as any;

        for(let i=0; i<this.jsonFiles.length;i++) 
        {
            let json = this.jsonFiles[i] as any;
            ///add participants
            for(let p of json.participants)
            {
                if(this.finalJson[p] === 'undefined')
                    this.finalJson.participants.push(p);
            }
            this.finalJson.participants = json.participants;

            //add messages
            for(let m of json.messages)
            {
                this.finalJson.messages.push(m);
            }
        }
    }

}
