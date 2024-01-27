import { Component } from '@angular/core';
import { AuthService } from './core/services/api/strapi/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from './core/interfaces/user';
import { CustomTranslateService } from './core/services/custom-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  estaEnLogin: boolean = false;
  lang: string = "es";
  user: User | undefined
  constructor(
    public auth: AuthService,
    private rotuer: Router,
    private routerActive: ActivatedRoute,
    public translate: CustomTranslateService
  ) {
    // Verifica si la ruta actual coincide con '/login'
    this.estaEnLogin = this.rotuer.url === '/login';

    // También puedes suscribirte a cambios en la ruta para manejar actualizaciones
    this.rotuer.events.subscribe(() => {
      this.estaEnLogin = this.rotuer.url === '/login';
    });
    this.auth.isLogged$.subscribe(logged => {
      console.log(logged)
      if(logged){
        this.rotuer.navigate(['/home']);
        this.auth.me().subscribe(_ => {
          console.log("Usuario logeado"+_.username)
          this.user = _
        })
      } else
        this.rotuer.navigate(['/login'])
    });
    this.translate.use(this.lang)
  }
  
  onLang(){
    if(this.lang=='es')
      this.lang='en';
    else
      this.lang='es';
    this.translate.use(this.lang);
    return false;    
  }

  onSingOut(){
    this.auth.logOut().subscribe(_=>{
      this.rotuer.navigate(['/login']);
      this.user = undefined;
    })
  }
}
