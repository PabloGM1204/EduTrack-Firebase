import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { UserCredentials } from '../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../interfaces/user-register-info';
import { JwtService } from '../jwt.service';
import { ApiService } from './api.service';
import { StrapiUploadResponse } from '../../interfaces/strapi';



@Injectable({
  providedIn: 'root'
})
export abstract class MediaService {  
  public abstract upload(blob:Blob):Observable<number[]>;
}