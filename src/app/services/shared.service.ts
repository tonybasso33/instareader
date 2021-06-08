import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

    private uploadedJson = new Subject<any>();
    private uploadedJson$ = this.uploadedJson.asObservable();

  constructor() { }

  getJsonFile(): Observable<any>{ 
    return of(this.uploadedJson$);
  }

  setJsonFile(json: any): any{
      this.uploadedJson = json;
  }
}
