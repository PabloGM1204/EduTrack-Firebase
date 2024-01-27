import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Alumno } from 'src/app/core/interfaces/alumno';
import { Nota } from 'src/app/core/interfaces/nota';
import { AlumnoService } from 'src/app/core/services/api/alumno.service';
import { NotasService } from 'src/app/core/services/api/notas.service';
import { ModalNotaComponent } from 'src/app/shared/components/modal-nota/modal-nota.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  // Variable que recibe la página para saber si crear un alumno nuevo, editar o ver las notas
  dato: any | null = 'new';
  // En el caso de ver las notas de un alumno necesito tambien el id
  id: any | null = 1;
  // Guardo los datos del alumno que voy a editar
  alumnoSeleccionado: Alumno | undefined;
  // Lista de las notas que tengo
  notas: Nota[] = [];
  // Para que muestre el loading
  mostrarContenido: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alumnoSvc: AlumnoService,
    private notasSvc: NotasService
  ) {
    
  }

  ngOnInit() {
    this.mostrarContenido = false
    // Obtengo el id que le pasamos por parametros de la ruta
    this.id = this.route.snapshot.paramMap.get('id');
    // Obtengo el dato('new','notas') que le pasamos por parametros de la ruta
    this.dato = this.route.snapshot.paramMap.get('dato');
    console.log("Que me llega a info: "+this.dato);
    // En el caso de que el dato sea notas cargamos el componente de las notas y se llamamos al método para cargar las notas
    if(this.dato == 'notas'){
      console.log("estamos en las notas y este es el id"+ this.id)
      // Cargamos las notas
      this.cargarNotas(this.id);
      // En el caso de que no sea notas ni tampoco new significa que es para editar un alumno, por lo que le paso el dato que es el id del alumno y lo cargo
    } else if(this.dato != 'New'){
      // Lo paso a numero porque al pasarlo como parametro de la ruta se pasa como string
      this.dato = Number(this.dato)
      // Cargamos el alumno
      this.cargarAlumno(this.dato)
    }
    // Para que cargue y en lo cargue este el loading
    setTimeout(() => {this.mostrarContenido = true},2000);
  }
  
  // Para volver a la página de alumnos
  onCancel(){
    this.router.navigate(['/alumnos']);
  }

  // Para cuando estemos o creando un nuevo alumno o editandolo y le demos a guardar
  onSubmit(alumno: Alumno){
    console.log(alumno)
    // En el caso de que sea un nuevo alumno
    if(this.dato == 'New'){
      this.alumnoSvc.addAlumno(alumno).subscribe(_ =>{
        console.log("Alumno creado");
        this.router.navigate(['/alumnos']);
      })
    } else {
      // En el caso de que sea un alumno editado
      this.alumnoSvc.updateAlumno(alumno).subscribe(_ => {
        console.log("Alumno modificado");
        this.router.navigate(['/alumnos']);
      })
    }
  }

  // Para cargar el alumno
  cargarAlumno(id: number){
    this.alumnoSvc.getAlumno(id).subscribe(_ => {
      // Guardamos el alumno seleccionado en la variable de clase
      this.alumnoSeleccionado = _;
      console.log(this.alumnoSeleccionado)
    });
  }

  // Para añadir una nota en el caso de que vayamos en el modo de notas
  anadirNota(nota: Nota){
    this.notasSvc.addNota(nota).subscribe({
      next: () => {
        this.cargarNotas(this.id)
      }
    })
  }

  // Para editar la nota la cual hemos seleccionado
  editarNotar(nota: Nota){
    this.notasSvc.updateNota(nota).subscribe({
      next: (notaModificada) => {
        // Encuentra el índice de la nota actualizada en la lista local
        const index = this.notas.findIndex(nota => nota.id === notaModificada.id);
        if (index !== -1) {
          // Actualiza la nota en la lista local
          this.notas[index] = notaModificada;
          this.notas = [...this.notas];
        }
      },
      error: (error) => {
        console.error("Error al actualizar la nota", error);
      }
    });
  }

  // Para eliminar la nota
  eliminarNota(nota: Nota){
    this.notasSvc.deleteNota(nota).subscribe(notas => {
      this.notas = notas;
    })
  }

  // Para cargar la nota
  cargarNotas(alumnoId: number) {
    this.notasSvc.getNotasPorAlumno(alumnoId).subscribe(notas => {
      this.notas = notas;
    });
  }


}
