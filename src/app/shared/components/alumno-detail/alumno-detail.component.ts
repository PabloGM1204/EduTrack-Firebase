import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alumno } from 'src/app/core/interfaces/alumno';

@Component({
  selector: 'app-alumno-detail',
  templateUrl: './alumno-detail.component.html',
  styleUrls: ['./alumno-detail.component.scss'],
})
export class AlumnoDetailComponent  implements OnInit {

  form: FormGroup;
  @Input() set alumno(_alumno: Alumno | undefined){
    if(_alumno){
      this.form.controls['id'].setValue(_alumno.id);
      this.form.controls['nombre'].setValue(_alumno?.nombre);
      this.form.controls['fechaNacimiento'].setValue(_alumno?.fechaNacimiento);
      this.form.controls['email'].setValue(_alumno?.email);
    }
  }

  @Output() onsubmit = new EventEmitter<Alumno>();

  constructor(
    private formBuilder:FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id:[null],
      nombre:['', [Validators.required]],
      email:['', [Validators.required]],
      fechaNacimiento:['2001-01-01', [Validators.required]]
    })
  }

  ngOnInit() {}

  onSubmit(){
    console.log(this.form.value)
    this.onsubmit.emit(this.form.value)
  }

}
