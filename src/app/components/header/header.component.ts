import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import * as globals from '../../../globals';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    text = [] as any;
    subscription: any;

    constructor(private language: TranslationService) {
        this.language.setLanguage(globals.language);
        this.subscription = this.language.getTexts(globals.language).subscribe(newText => {
            this.text = newText;
        });
        
    }

    ngOnInit(): void {
        this.setLanguage(globals.language);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe;
    }
    
    setLanguage(lang: string) {
        this.language.setLanguage(lang);
        this.subscription = this.language.getTexts(lang).subscribe(newText => {
            this.text = newText;
        });

        let l = document.querySelectorAll(".active") as any;
        for(let e of l)
        {
            e.classList.remove('active');
        }
        document.querySelector("#"+lang)!.classList.add("active");
    }

}
