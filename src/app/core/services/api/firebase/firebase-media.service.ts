import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, map, tap } from 'rxjs';
import { UserCredentials } from '../../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../../interfaces/user-register-info';
import { JwtService } from '../../jwt.service';
import { ApiService } from '../api.service';
import { StrapiUploadResponse } from '../../../interfaces/strapi';
import { User } from '../../../interfaces/user';
import { MediaService } from '../media.service';

export class FirebaseMediaService extends MediaService{

  constructor(
    private apiSvc:ApiService
  ) { 
    super();
  }

  public upload(blob:Blob):Observable<number[]>{
    const formData = new FormData();
    formData.append('files', blob);
    return this.apiSvc.post('/upload', formData).pipe(map((response:StrapiUploadResponse)=>{
      return response.map(media=>media.id);
    }));
  }

}