import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { JwtService } from '../../jwt.service';
import { ApiService } from '../api.service';
import { UserCredentials } from '../../../interfaces/user-credentials';
import { Observable, lastValueFrom, map } from 'rxjs';
import { StrapiExtendedUser, StrapiLoginPayload, StrapiLoginResponse, StrapiRegisterPayLoad, StrapiRegisterResponse } from '../../../interfaces/strapi';
import { UserRegisterInfo } from '../../../interfaces/user-register-info';
import { User } from '../../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthStrapiService extends AuthService {

  constructor(
    private jwtSvc: JwtService,
    private apiSvc: ApiService
  ) {
    super();
    this.init();
  }

  // Al iniciar el servicio le decimos que cargue el token
  private init(){
    this.jwtSvc.loadToken().subscribe(_=>{
      this._logged.next(true);
    })
  }

  // Método para hacer el login
  // Le paso las credenciales con los datos necesarios y se los pasa al strapi y recibimos el jwt en caso de que sea correcto
  public login(credentials: UserCredentials): Observable<void>{
    return new Observable<void>(obs => {
      const _credentials: StrapiLoginPayload = {
        identifier: credentials.username,
        password: credentials.password
      }
      this.apiSvc.post("/auth/local", _credentials).subscribe({
        next:async (data:StrapiLoginResponse) => {
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          this._logged.next(data && data.jwt != '');
          obs.next();
          obs.complete();
        },
        error: err => {
          obs.error(err);
        }
      });
    });
  }

  // Método para salirme de la cuenta
  // Le pido al servicio que me destruya el token(el lo pone a vacio)
  public logOut(): Observable<void>{
    return this.jwtSvc.destroyToken().pipe(map(_=> {
      this._logged.next(false);
      return;
    }));
  }

  // Método para registrarse
  public register(info: any): Observable<void> {
    return new Observable<void>(obs => {
      const _info = {
        email: info.email,
        username: info.username,
        password: info.password
      }
      this.apiSvc.post("/auth/local/register", _info).subscribe({
        next:async (data:StrapiRegisterResponse) => {
          let connected = data && data.jwt != "";
          this._logged.next(connected);
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          obs.next();
          obs.complete();
        },
        error: err => {
          obs.next(err)
        }
      })
    })
  }

  // Método para poder recoger los datos del usuario que ha iniciado sesion
  public me(): Observable<User> {
    return new Observable<User>(obs => {
      /*this.apiSvc.get('/users/me').subscribe({
        next:async (user) => {
          let ret: User = {
            id: user.id,
            //username: user.username,
            email: user.email
          }
          //console.log("Datos del usuario"+ret.username)
          obs.next(ret);
          obs.complete();
        },
        error: err => {
          obs.error(err);
        }*/
    })
  }

  // Método para eliminar a un usuario en el caso de que quieras borrar la cuenta
  public deleteAccount(id: number): Observable<void>{
    return new Observable<void>(obs=>{
      this.apiSvc.delete(`/users/${id}`).subscribe(_=>{
        console.log("Usuario eliminado")
      });
    });
  }
}
