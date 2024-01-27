import { Injectable, inject} from '@angular/core';
import { Observable} from 'rxjs';
import { ApiService } from './api.service';
import { PaginatedData } from '../../interfaces/data';


@Injectable({
  providedIn: 'root'
})
export abstract class DataService{
  
  public abstract query<T>(resource:string, params:any):Observable<PaginatedData<T>>;

  public abstract get<T>(resource:string):Observable<T>;

  public abstract post<T>(resource:string, data:any):Observable<T>;

  public abstract put<T>(resource:string, data:any):Observable<T>;

  public abstract delete<T>(resource:string):Observable<T>;
}