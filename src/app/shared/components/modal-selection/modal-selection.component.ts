import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Mesa } from 'src/app/core/interfaces/mesa';


@Component({
  selector: 'app-modal-selection',
  templateUrl: './modal-selection.component.html',
  styleUrls: ['./modal-selection.component.scss'],
})
export class ModalSelectionComponent  implements OnInit {

  mode:'New' | 'Edit' | undefined;
  form:FormGroup;
  @Input() set mesa(_mesa: Mesa | null){
    if(_mesa){
      this.form.controls['alumnoId'].setValue(_mesa.AlumnoID);
      this.form.controls['nombre'].setValue(_mesa.nombre);
      this.mode = 'Edit';
    } else {
      this.mode = 'New'
    }
  }
  
  constructor(
    private formBuilder:FormBuilder,
    private _modal: ModalController
    
  ) {
    this.form = this.formBuilder.group({
      alumnoId:[null],
      nombre:['', [Validators.required]]
    })
  }
  
  ngOnInit() {
    console.log(this.mode)
  }

  onSubmit(){
    console.log("Id nuevo del alumno: "+ this.form.value.alumnoId)
    this._modal.dismiss(this.form.value, 'ok');
  }

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }

  onDelete(){
    this._modal.dismiss(this.form.value, 'delete');
  }

  onSave(){
    this._modal.dismiss(this.form.value, 'ok');
  }

}
