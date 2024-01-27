import { Component, Input, OnInit } from '@angular/core';
import { Alumno } from 'src/app/core/interfaces/alumno';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss'],
})
export class AlumnoComponent  implements OnInit {

  @Input() alumno: Alumno | null = null;

  @Input() name: string | null = null;
  @Input() fechaNacimiento: string | null = null;
  @Input() email: string | null = null;

  constructor() { }

  ngOnInit() {
    console.log(this.name)
    console.log(this.fechaNacimiento)
    console.log(this.email)
  }

}
