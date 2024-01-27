import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Alumno } from 'src/app/core/interfaces/alumno';

@Component({
  selector: 'app-alumno-item',
  templateUrl: './alumno-item.component.html',
  styleUrls: ['./alumno-item.component.scss'],
})
export class AlumnoItemComponent  implements OnInit {

  private _alumno: Alumno | undefined;

  // Recibo el objeto alumno y actualizo _alumno con el nuevo valor que ha llegado
  @Input('alumno') set alumno(_alumno: Alumno | undefined){
    this._alumno = _alumno
  }

  @Output('clicked') clicked = new EventEmitter();

  get alumno(): Alumno | undefined{
    return this._alumno;
  }

  constructor() { }

  ngOnInit() {}

  onAlumnoClicked(){
    this.clicked.emit(this._alumno);
  }

}
