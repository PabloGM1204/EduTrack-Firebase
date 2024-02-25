import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { Alumno } from 'src/app/core/interfaces/alumno';
import { Nota } from 'src/app/core/interfaces/nota';
import { AlumnoService } from 'src/app/core/services/api/alumno.service';
import { NotasService } from 'src/app/core/services/api/notas.service';
import { ModalNotaComponent } from 'src/app/shared/components/modal-nota/modal-nota.component';
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { FirebaseMediaService } from 'src/app/core/services/api/firebase/firebase-media.service';
import { MediaService } from 'src/app/core/services/api/media.service';

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
    private notasSvc: NotasService,
    private mediaSvc: MediaService
  ) {
    
  }

  ngOnInit() {
    this.notasSvc.subscribeToNotasCollection();
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
  onSubmit(alumno: any){
    console.log(alumno)
    // En el caso de que sea un nuevo alumno
    if(this.dato == 'New'){
      if(alumno.imagen.startsWith('http')){
        console.log("Alumno que recibo ", alumno)
        let _alumno: Alumno = {
          ...alumno,
          foto: alumno.imagen
        }
        this.alumnoSvc.addAlumno(_alumno).subscribe(_ =>{
          console.log("Alumno creado");
          this.router.navigate(['/alumnos']);
        });
      } else {
        dataURLtoBlob(alumno.imagen, (blob: Blob) =>{
          this.mediaSvc.upload(blob).subscribe({
            next:(media: any) => {
              alumno.foto = media[0].url_thumbnail
              this.alumnoSvc.addAlumno(alumno).subscribe(_ =>{
                console.log("Alumno creado");
                this.router.navigate(['/alumnos']);
              });
            }
          })
          console.log("Nota ", alumno)
        });
      }
    } else {
      // En el caso de que sea un alumno editado
      if(alumno.imagen.startsWith('http')){
        console.log("Alumno que recibo ", alumno)
        let _alumno: Alumno = {
          ...alumno,
          foto: alumno.imagen
        }
        this.alumnoSvc.updateAlumno(_alumno).subscribe(_ => {
          console.log("Alumno modificado");
          this.router.navigate(['/alumnos']);
        })
      } else {
        dataURLtoBlob(alumno.imagen, (blob: Blob) => {
          this.mediaSvc.upload(blob).subscribe({
            next:(media: any) => {
              alumno.foto = media[0].url_thumbnail
              this.alumnoSvc.updateAlumno(alumno).subscribe(_ => {
                console.log("Alumno modificado");
                this.router.navigate(['/alumnos']);
              })
            }
          })
        })
      }
    }
  }

  // Para cargar el alumno
  cargarAlumno(id: string){
    console.log("Id que se le pasa: "+id)
    this.alumnoSvc.getAlumno(id).subscribe(_ => {
      // Guardamos el alumno seleccionado en la variable de clase
      this.alumnoSeleccionado = _;
      console.log("Alumno que se ha recogido por el id"+ JSON.stringify(this.alumnoSeleccionado))
    });
  }

  // Para añadir una nota en el caso de que vayamos en el modo de notas
  anadirNota(nota: any){
    this.notasSvc.addNota(nota).subscribe({
      next: () => {
        this.cargarNotas(this.id);
      }
    })
    /*dataURLtoBlob(nota.foto, (blob: Blob) =>{
      this.mediaSvc.upload(blob).subscribe({
        next:(media: any) => {
          nota.foto = media[0]
          
          });
        }
      })
      console.log("Nota ", nota)
    });*/
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
  eliminarNota(nota: any){
    this.notasSvc.deleteNota(nota).subscribe(notas => {
      this.notas = notas;
    })
  }

  // Para cargar la nota
  cargarNotas(alumnoId: number) {
    /*this.notasSvc.getNotasPorAlumno(alumnoId).subscribe(notas => {
      this.notas = notas;
    });*/
    this.notasSvc.notas$.pipe(
      map(notas => notas.filter(nota => nota.alumnoID === alumnoId))
    ).subscribe(filteredNotas => {
      this.notas = filteredNotas;
      console.log("RESULTADO DE LAS NOTAS FILTRADAS", this.notas);
    });
  
    // Llamar al método para suscribirse a la colección de notas
     // Supongamos que 123 es el ID del alumno
  }

  subirFoto(data: any){
    console.log("Datos que me da la imagen ", data)
    dataURLtoBlob(data, function(blob: any){
      console.log("Esto es el blob", blob)
    });
  }


}
