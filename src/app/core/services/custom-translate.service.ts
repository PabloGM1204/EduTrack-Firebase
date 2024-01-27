import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {
  
  private _language:BehaviorSubject<string> = new BehaviorSubject<string>('es');
  public language$ = this._language.asObservable();

  constructor(
    private translate:TranslateService
  ) { 
    this.init();
  }

  private async init(){
    this.translate.addLangs(['es','en']);
    this.translate.setDefaultLang(this._language.value);
  }

  use(language:string){
    lastValueFrom(this.translate.use(language)).then(_=>{
      this._language.next(language);
    }).catch(err=>{
      console.error(err);
    });  
  }


  get(key:string):Observable<string>{
    return this.translate.get(key);
  }
}
