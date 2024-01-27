import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  componenteLogin = true;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {}

  cambioComponente(){
    this.componenteLogin = !this.componenteLogin
  }

  // Método para hacer el login
  // al hacer click recibe los datos para el login y hacemos el login, en caso de ir bien pasaria al home
  onLogin(credenciales: UserCredentials){
    this.auth.login(credenciales).subscribe({
      next: data => {
        this.router.navigate(['/home']);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  onRegister(credenciales: UserCredentials){
    this.auth.register(credenciales).subscribe({
      next: data => {
        this.router.navigate(['/home']);
      },
      error: err => {
        console.log(err)
      }
    })
  }

}
