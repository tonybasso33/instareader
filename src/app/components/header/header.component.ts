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

}
