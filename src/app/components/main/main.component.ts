import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Word } from 'src/app/models/word';
import * as globals from '../../../globals';
import { words, expressions } from '../../../assets/js/filters';
import fix from '../../../assets/js/encodeFix';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    dataPath = globals.dataPath;
    results = globals.results as any;
    itemCounter = 0;
    jsonFile = [];
    uploaded = false;

  constructor() { }

  ngOnInit(): void {
  }


  doParsing(json: any)
  {
      console.log(json);
      let { messages, participants } = JSON.parse(fix(JSON.stringify(json)));
      //add users
      for (let index of Object.keys(participants)) 
      {
          let p = participants[index];
          let user = new User(p.name, [], 0);
          this.results.push(user);
      }
      
      //count filters
      for (let index of Object.keys(messages)) 
      {
          let m = messages[index];
          if(m.content)
          {
  
              //count words
              let message = m.content.toLowerCase();
              let mWords = message.split(' ');
              for(let mWord of mWords)
              {
                  for(let w of words)
                  {
                      if(mWord == w)
                      {
                          this.addCount(m.sender_name, w);
                      }
                  }
              }
  
              //count expressions
              for(let ex of expressions)
                  if(message.includes(ex))
                      this.addCount(m.sender_name, ex);
                  
              for(let user of this.results)
              {
                  if(user.name == m.sender_name)
                      user.total++;
              }
          }
          this.itemCounter++;
      }
  
      this.display();
  }

  /**
   * 
   * displays this.results in the console 
   * 
   */
  display()
  {
      let totalMessages = 0.
      for(let user of this.results)
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

          totalMessages += user.total;
          console.log(`\nTotal words found: ${total}`);
          console.log(`Total messages: ${user.total}`);
          console.log("----------------");
      }

      console.log(`\n| Total messages: ${totalMessages}`);
      console.log(`| Total items: ${this.itemCounter}\n`);
      this.uploaded = true;
  }


  /**
   * adds a count to a word for a user
   * 
   * @param {string} userName user concerned
   * @param {string} wordName word to count 
   */
  addCount(userName: string, wordName: string) 
  {
      let exists = false;

      //check if word has already been said by user 
      for (let user of this.results) 
      {
          if (user.name == userName) 
          {
              for (let word of user.words)
              {
                  if (word.name == wordName) 
                  {
                      user.total++; //add count to total words
                      word.count++;
                      console.log(`${userName} + ${wordName}`)
                      exists = true;
                  }
              }
          }

      }

      //add word to user list
      if (exists == false) 
      {
          let newWord = new Word(wordName, 1);

          for (let user of this.results) 
          {
              if (user.name == userName) 
              {
                  user.total++; //add count to total words
                  user.words.push(newWord);
                  console.log(`${userName} > ${wordName}`)
              }
          }
      }
    }

    loadJson(event: any) 
    {
        this.jsonFile = [];
        let jsonFile = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(jsonFile, "UTF-8");
        fileReader.onload = () => {
            console.log(jsonFile);
            this.jsonFile = jsonFile;
            this.doParsing(JSON.parse(fileReader.result as any));
            console.log(JSON.parse(fileReader.result as any));
        }
        fileReader.onerror = (error) => {
            console.log(error);
        }
    }
}
