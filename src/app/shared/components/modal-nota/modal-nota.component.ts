import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Nota } from 'src/app/core/interfaces/nota';

@Component({
  selector: 'app-modal-nota',
  templateUrl: './modal-nota.component.html',
  styleUrls: ['./modal-nota.component.scss'],
})
export class ModalNotaComponent  implements OnInit {

  notaForm: FormGroup;
  @Input() set nota(_nota: Nota | null){
    if(_nota){
      this.notaForm.controls['calificacion'].setValue(_nota.calificacion);
      this.notaForm.controls['fecha'].setValue(_nota.fecha);
      this.notaForm.controls['asignatura'].setValue(_nota.asignatura);
      this.notaForm.controls['descripcion'].setValue(_nota.descripcion);
    }
  }


  constructor(
    private _modal:ModalController,
    private fb: FormBuilder
  ) { 
    this.notaForm = this.fb.group({
      calificacion:[0, [Validators.required]],
      fecha:['', [Validators.required]],
      asignatura:['', [Validators.required]],
      descripcion:['', [Validators.required]]
    })
  }

  ngOnInit() {
    
  }

  onSubmit(){
    this._modal.dismiss(this.notaForm.value, 'ok');
  } 

}
