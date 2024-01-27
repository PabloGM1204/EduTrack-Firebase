import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { PasswordValidation } from 'src/app/core/validators/password';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent  implements OnInit {

  @Output() hacerRegister = new EventEmitter<UserCredentials>();
  
  form: FormGroup | null = null;

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      nickname:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, PasswordValidation.passwordProto('password')]],
      confirm:['', [Validators.required, PasswordValidation.passwordProto('confirm')]]
    }, {validator:[PasswordValidation.passwordMatch('password','confirm') ]});
  }

  ngOnInit() {}

  onSubmit(){
    this.hacerRegister.emit(this.form?.value)
  }

  hasError(controlName:string):boolean|undefined{
    return this.form?.get(controlName)?.invalid;
  }

  hasTouched(controlName:string):boolean|undefined{
    return this.form?.get(controlName)?.touched;
  }



}
