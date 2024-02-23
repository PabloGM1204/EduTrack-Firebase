import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { Alumno } from 'src/app/core/interfaces/alumno';
import { AlumnoService } from 'src/app/core/services/api/alumno.service';
import { MesaService } from 'src/app/core/services/api/mesa.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {

  constructor(
    public alumnosSvc: AlumnoService,
    private router: Router,
    private mesaSvc: MesaService
  ) { }

  ngOnInit() {
    this.alumnosSvc.getAll().subscribe();
  }

  crearAlumno(){
    this.router.navigate(['/info', 'New'])
  }

  editarAlumno(id: string){
    this.router.navigate(['/info', id])
  }

  eliminarAlumno(alumno: Alumno){
    this.alumnosSvc.deleteAlumno(alumno).subscribe(_ => {
      console.log("Alumno eliminado")
      this.mesaSvc.mesas$.pipe(
        take(1) // Tomar solo la primera emisión para evitar suscripciones múltiples
      ).subscribe(mesas => {
        // Iterar sobre cada mesa
        mesas.forEach((mesa: any) => {
          // Verificar si el ID del alumno en la mesa coincide con el ID del alumno eliminado
          if (mesa.AlumnoID === alumno.id) {
            // Actualizar el ID del alumno en la mesa a cero
            mesa.AlumnoID = 0;
            // Actualizar la mesa en la base de datos
            this.mesaSvc.updateMesa(mesa).subscribe(() => {
              console.log(`Alumno eliminado de la mesa ${mesa.id}`);
            }, error => {
              console.error(`Error al actualizar la mesa ${mesa.id}: ${error}`);
            });
          }
        });
      });
    }, error => {
      console.error("Error al eliminar el alumno:", error);
    });
  }
  actualizarNotas(id: string){
    console.log("notas"+id)
    this.router.navigate(['/info', 'notas', id]);
  }

}
