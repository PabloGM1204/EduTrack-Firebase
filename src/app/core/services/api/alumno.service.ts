import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, from, lastValueFrom, map, tap } from 'rxjs';
import { Alumno } from '../../interfaces/alumno';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { MesaService } from './mesa.service';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  // Lista de las mesas que hay
  private _alumnos: BehaviorSubject<Alumno[]> = new BehaviorSubject<Alumno[]>([]);
  alumnos$: Observable<Alumno[]> = this._alumnos.asObservable();

  constructor(
    private firebaseSvc: FirebaseService,
    private mesaSvc: MesaService
  ) { }

  // ---------Métodos---------

  public getAll(): Observable<Alumno[]>{
    return from(this.firebaseSvc.getDocuments('alumnos')).pipe(
      map((documents: any[]) => {
        // Mapeamos los documentos de Firebase a objetos Mesa
        return documents.map(document => ({
          id: document.id,
          nombre: document.data.Nombre,
          email: document.data.Email,
          fechaNacimiento: document.data.FechaNacimiento
        }));
      }),
      tap(data => {
        console.log('Datos devueltos de alumnos:', data),
        this._alumnos.next(data)
      })
    );
  }

  /*public query(q: string): Observable<Alumno[]>{
    return this.http.get('/alumnos?q='+q)
  }*/

  public getAlumno(id: string): Observable<Alumno>{
    return from(this.firebaseSvc.getDocument('alumnos', id)).pipe(
      map((alumno: any) => {
        return {
          id: alumno.id,
          nombre: alumno.data.Nombre,
          fechaNacimiento: alumno.data.FechaNacimiento,
          email: alumno.data.Email
        };
      }),
      tap(alumno => {
        console.log("Alumno entrado: ", JSON.stringify(alumno));
      }),
      catchError(error => {
        console.error("Error al obtener el alumno:", error);
        throw error;
      })
    );
  }


  public updateAlumno(_alumno: Alumno): Observable<void> {
    console.log(_alumno.id)
    let actualizarAlumno = {
      Nombre: _alumno.nombre,
      FechaNacimiento: _alumno.fechaNacimiento,
      Email: _alumno.email
    }
    return from(this.firebaseSvc.updateDocument('alumnos', _alumno.id, actualizarAlumno)).pipe(
      tap(_ => {
        this.getAll().subscribe();
      })
    );
  }


  public addAlumno(_alumno: Alumno): Observable<Alumno>{
    let crearAlumno = {
      Nombre: _alumno.nombre,
      FechaNacimiento: _alumno.fechaNacimiento,
      Email: _alumno.email
    };
    console.log(crearAlumno)
    return from(this.firebaseSvc.createDocument('alumnos', crearAlumno)).pipe(
      map((uuid: string) => {
        // Una vez que se ha creado el documento en la base de datos,
        // devolvemos el objeto Mesa con su ID asignado
        return {
          ..._alumno,
          uuid
        };
      }),
      tap(_ => {
        this.getAll().subscribe();
      })
    );
  }


  public deleteAlumno(alumno: Alumno): Observable<Alumno>{
    return new Observable<Alumno> (obs => {from(this.firebaseSvc.deleteDocument('alumnos', alumno.id)).subscribe(_ => {
      this.getAll().subscribe(_ => {
        obs.next(alumno)
      })
    })})
  }


}