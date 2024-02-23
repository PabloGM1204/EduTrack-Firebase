import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { MediaService } from '../media.service';
import { Observable, map } from 'rxjs';
import { StrapiUploadResponse } from 'src/app/core/interfaces/strapi';

@Injectable({
  providedIn: 'root'
})
export class StrapiMediaService extends MediaService {
  
  constructor(
    private apiSvc:ApiService
  ) { 
    super();
  }

  public upload(blob:Blob):Observable<any[]>{
    const formData = new FormData();
    formData.append('files', blob);
    return this.apiSvc.post('/upload', formData).pipe(map((response:StrapiUploadResponse)=>{
      return response.map(media=>media.id);
    }));
  }

}