import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import * as globals from '../../../globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

    text = [] as any;
    subscription: any;


    constructor(private language: TranslationService) {
        this.setLanguage(globals.defaultLanguage);
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
}

  setLanguage(lang: string) {
    this.subscription = this.language.getTexts(lang).subscribe(newText => {
        this.text = newText;
    });
    }

    goTop()
    {
        let e = document.getElementById("header")!;
        e.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

    }

}
