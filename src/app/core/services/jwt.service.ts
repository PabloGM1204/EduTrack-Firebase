import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable } from 'rxjs';

// Declaración de tipo
export type JwtToken = string;
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  // Token para poder entrar en la página
  token: string = "";

  constructor() { }

  // Método para cargar el token
  // En el caso de que el navegador tenga ya el token, lo comprueba y lo devolvemos en casa de que no lo encuentra, lo devuelve
  loadToken(): Observable<JwtToken>{
    return new Observable<JwtToken>(observer =>{
      Preferences.get({key:'jwtToken'}).then((ret: any) => {
        if(ret['value']) {
          this.token = JSON.parse(ret.value);
          if(this.token == '' || this.token == null){
            observer.error('No hay token')
          } else {
            observer.next(this.token);
            observer.complete();
          }
        } else {
          observer.error('No token')
        }
      }).catch((error: any) => observer.next(error));
    });
  }


  // Método para obtener el toekn
  getToken(): JwtToken{
    return this.token;
  }


  // Método para guardar el token
  // Guardamos el token con el capacitor en el navegador
  saveToken(token: JwtToken): Observable<JwtToken>{
    return new Observable<JwtToken>(observer =>{
      Preferences.set({
        key: 'jwtToken',
        value: JSON.stringify(token)
      }).then((_) =>{
        this.token = token;
        observer.next(this.token);
        observer.complete();
      }).catch((error: any) => {
        observer.error(error);
      });
    });
  }


  // Método para destruir el token (cuando hace el logOut)
  // Lo que hace es poner la variable del token a vacio
  destroyToken(): Observable<JwtToken>{
    this.token = "";
    return this.saveToken(this.token);
  }
}
