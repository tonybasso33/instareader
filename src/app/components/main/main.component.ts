import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Word } from 'src/app/models/word';
import * as globals from '../../../globals';
import fix from '../../../assets/js/encodeFix';
import { TranslationService } from '../../services/translation.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

    text = [] as any;
    subscription: any;

    dataPath = globals.dataPath;
    results = [] as any;
    
    uploaded = false;
    jsonFile = [];
    
    filtersInput = "";
    
    filters= [] as string[];
    words = [] as string[];
    expressions = [] as string[];
    
    itemCounter = 0;

    constructor(private language: TranslationService) {
            this.setLanguage(globals.defaultLanguage);
     }

    ngOnInit(): void {
        this.setLanguage(globals.defaultLanguage);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe;
    } 

    setLanguage(lang: string)
    {
        this.subscription = this.language.getTexts(lang).subscribe(newText => {
              this.text = newText;
          });
    }

    getFilters() {
        let fInput = this.filtersInput.toLowerCase().split(";");

        for (let filter of fInput) {
            let f = filter.split(" ");
                if (f.length > 2) 
                {
                    if(!this.expressions.includes(filter))
                    {
                        this.expressions.push(filter);
                        this.filters.push(filter);
                    }
                }
                else
                {
                    if(!this.words.includes(filter))
                    {
                        this.filters.push(filter);
                        this.words.push(filter);
                    }
                }

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
        this.results = [];
        this.words = [];
        this.expressions = [];
        this.itemCounter = 0;
        this.uploaded = false;
        document.getElementById("results")!.style.display = 'none';
    
    }

    doParsing() {
        this.reset();
        this.getFilters()
        console.log(this.words);
        let { messages, participants } = JSON.parse(fix(JSON.stringify(this.jsonFile)));

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

                //count words
                let message = m.content.toLowerCase();
                let mWords = message.split(' ');
                for (let mWord of mWords) {
                    for (let w of this.words) {
                        if (mWord == w) {
                            this.addCount(m.sender_name, w);
                        }
                    }
                }

                //count expressions
                for (let ex of this.expressions)
                    if (message.includes(ex))
                        this.addCount(m.sender_name, ex);

                for (let user of this.results) {
                    if (user.name == m.sender_name)
                        user.total++;
                }
            }
            this.itemCounter++;
        }

        this.addZeros();
        this.display();
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
            for (let filter of this.sortFiltersArray(this.filters)) {
                let check = user.words.find((word: any) => word.name === filter);
                if (typeof check === 'undefined') {
                    console.warn(check);
                    let w = new Word(filter, 0);
                    user.words.push(w);
                }

            }
        }
    }

    setJson(event: any) {
        this.jsonFile = [];
        let jsonFile = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(jsonFile, "UTF-8");
        fileReader.onload = () => {
            this.jsonFile = [];
            this.reset();
            this.jsonFile = JSON.parse(fileReader.result as any);
        }
        fileReader.onerror = (error) => {
            console.log(error);
        }
    }
}
