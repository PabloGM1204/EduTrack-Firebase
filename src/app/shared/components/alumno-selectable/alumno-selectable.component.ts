import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonPopover } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Alumno } from 'src/app/core/interfaces/alumno';
import { AlumnoService } from 'src/app/core/services/api/alumno.service';

export const ALUMNO_SELECTABLE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AlumnoSelectableComponent),
  multi: true
}

@Component({
  selector: 'app-alumno-selectable',
  templateUrl: './alumno-selectable.component.html',
  styleUrls: ['./alumno-selectable.component.scss'],
  providers:[ALUMNO_SELECTABLE_VALUE_ACCESOR]
})
export class AlumnoSelectableComponent  implements OnInit, ControlValueAccessor {

  alumnoSelected: Alumno | undefined;
  disable: boolean = false;
  alumnos: Alumno[] = [];


  constructor(
    private alumnoSvc: AlumnoService
  ) { }

  ngOnInit() {}

  propagateChange = (obj: any) => {}

  async onLoadAlumnos(){
    console.log("Selectable click")
    this.alumnos = await lastValueFrom(this.alumnoSvc.getAll());
    console.log(this.alumnos);
  }

  private async selectAlumno(alumnoId: number | undefined, propagate: boolean = false){
    if(alumnoId){
      this.alumnoSelected = await lastValueFrom(this.alumnoSvc.getAlumno(alumnoId));
      console.log(this.alumnoSelected.id+ " Es el id")
    } else {
      this.alumnoSelected = undefined;
    }

    if(propagate)
      this.propagateChange(this.alumnoSelected);
  }

  
  writeValue(obj: any): void {
    this.selectAlumno(obj)
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
      
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }

  onAlumnoClicked(popover: IonPopover, alumno: Alumno){
    this.selectAlumno(alumno.id, true);
    popover.dismiss();
  }

  deselect(popover: IonPopover | null = null){
    this.selectAlumno(undefined, true);
    if(popover)
      popover.dismiss();
  }

}
