import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
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
      this.capturedImage = _alumno?.foto
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
      fechaNacimiento:['2001-01-01', [Validators.required]],
      imagen:['']
    })
  }

  ngOnInit() {}

  onSubmit(){
    this.form.patchValue({
      imagen: this.capturedImage
    })
    console.log(this.form.value)
    this.onsubmit.emit(this.form.value)
  }

  capturedImage: string | undefined = "";

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    this.capturedImage = image.webPath;
    /*this.form.patchValue({
      imagen: this.capturedImage
    })*/
  }

}
