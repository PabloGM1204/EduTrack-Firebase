import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http/http-client.provider';
import { JwtService } from '../jwt.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClientProvider,
    private jwt: JwtService
  ) { }

  // Método para obtener la url que le pasamos y ponerle los datos para iniciar sesión
  getHeader(url: string, accept = null, contentType = null){
    var header: any = {};
    if(accept)
      header['Accept'] = accept;
    if(contentType)
      header['Content-Type'] = contentType;
    if(!url.includes('auth'))
      header['Authorization']= `Bearer ${this.jwt.getToken()}`
    return header;
  }

  // Método para obtener el método
  getImage(url: string): Observable<any>{
    return this.http.getImage(url);
  }

  // Método para obtener la información desde la url
  getDataFromUrl(url: string): Observable<any>{
    return this.http.get(url, {}, this.getHeader(url));
  }

  // Método que hace un get al endoint que le pasamos
  get(path: string, params: any = {}): Observable<any>{
    var url = `${environment.ApiStrapiUrl}${path}`;
    return this.http.get(url, params, this.getHeader(url));
  }

  // Método para actualizar
  put(path: string, body: Object = {}): Observable<any>{
    var url = `${environment.ApiStrapiUrl}${path}`;
    return this.http.put(url, body, this.getHeader(url));
  }

  // Método para hacer un post(crear)
  post(path: string, body: Object = {}, content_type = null): Observable<any>{
    var url = `${environment.ApiStrapiUrl}${path}`;
    return this.http.post(url, body, this.getHeader(url));
  }

  // Método para actualizar (strapi no lo hace ya que con el mismo put actualiza)
  patch(path: string, body: Object = {}, content_type = null): Observable<any>{
    var url = `${environment.ApiStrapiUrl}${path}`;
    return this.http.patch(url, body, this.getHeader(url));
  }

  // Método para eliminar 
  delete(path: string, params: Object = {}): Observable<any>{
    var url = `${environment.ApiStrapiUrl}${path}`;
    return this.http.delete(url, params, this.getHeader(url))
  }
}
