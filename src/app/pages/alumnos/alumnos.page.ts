import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Alumno } from 'src/app/core/interfaces/alumno';
import { AlumnoService } from 'src/app/core/services/api/alumno.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
})
export class AlumnosPage implements OnInit {

  constructor(
    public alumnosSvc: AlumnoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.alumnosSvc.getAll().subscribe();
  }

  crearAlumno(){
    this.router.navigate(['/info', 'New'])
  }

  editarAlumno(id: number){
    this.router.navigate(['/info', id])
  }

  eliminarAlumno(alumno: Alumno){
    this.alumnosSvc.deleteAlumno(alumno).subscribe(_ => {
      console.log("Alumno eliminado")
    })
  }

  actualizarNotas(id: number){
    console.log("notas"+id)
    this.router.navigate(['/info', 'notas', id]);
  }

}
