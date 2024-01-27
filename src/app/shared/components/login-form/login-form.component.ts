import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent  implements OnInit {

  @Input('username') set username(value: string){
    this.form?.controls['username'].setValue(value);
  }

  @Output() hacerLogin = new EventEmitter<UserCredentials>();

  form: FormGroup | null = null;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      username:['', [Validators.required]],
      password:['', [Validators.required]]
    });
  }

  ngOnInit() {}

  // Hacer que aparte de enviar los datos tambien ponemos el espacio de la contraseña a vacio por seguridad
  onSubmit(){
    this.hacerLogin.emit(this.form?.value);
    this.form?.controls['password'].setValue('');
  }
}
