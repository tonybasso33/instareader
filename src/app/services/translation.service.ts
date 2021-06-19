import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import language from '../../assets/language.json';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

    private textSubject = new Subject<any>();
    private language = "english";

  constructor() { 
  }

  setLanguage(lang: string)
  {
      this.language = lang;
  }

  getLanguage()
  {
      return this.language;
  }

  setText(lang:string){
    this.textSubject.next(language[lang]);
  }

  getTexts(lang:string): Observable<any>{
    this.setText(lang);
    return this.textSubject.asObservable();
  }
}
