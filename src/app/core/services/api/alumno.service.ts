import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, lastValueFrom, map, tap } from 'rxjs';
import { Alumno } from '../../interfaces/alumno';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { MesaService } from './mesa.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  // Lista de las mesas que hay
  private _alumnos: BehaviorSubject<Alumno[]> = new BehaviorSubject<Alumno[]>([]);
  alumnos$: Observable<Alumno[]> = this._alumnos.asObservable();

  constructor(
    private http: ApiService,
    private mesaSvc: MesaService
  ) { }

  // ---------Métodos---------

  public getAll(): Observable<Alumno[]>{
  
    return this.http.get('/alumnos').pipe(map(response => response.data.map((item: { id: any; attributes: { Nombre: any; Email: any; FechaNacimiento: any }; }) => ({
      id: item.id,
      nombre: item.attributes.Nombre,
      email: item.attributes.Email,
      fechaNacimiento: item.attributes.FechaNacimiento
    }))),
    tap(alumnos => {
      if(Array.isArray(alumnos)){
        this._alumnos.next(alumnos);
      } else{
        console.log("ADIOS")
      }
    })
    )
  }

  public query(q: string): Observable<Alumno[]>{
    return this.http.get('/alumnos?q='+q)
  }

  public getAlumno(id: number): Observable<Alumno>{
    return this.http.get(`/alumnos/${id}`).pipe(map(response => {
      const attributes = response.data.attributes;
      const alumnoMapeado: Alumno = {
        id: response.data.id,
        nombre: attributes.Nombre,
        fechaNacimiento: attributes.FechaNacimiento,
        email: attributes.Email
      };
      console.log("Alumno mapeado "+ alumnoMapeado.id);
      return alumnoMapeado;
    }))
  }


  public updateAlumno(_alumno: Alumno): Observable<Alumno> {
    console.log(_alumno.id)
    let actualizarAlumno = {
      data: {
        Nombre: _alumno.nombre,
        FechaNacimiento: _alumno.fechaNacimiento,
        Email: _alumno.email
      }
    }
    return new Observable<Alumno>(obs =>{
      this.http.put(`/alumnos/${_alumno.id}`, actualizarAlumno).subscribe(_=>{
        console.log(_alumno)
        obs.next(_alumno);
        this.getAll().subscribe()
        this.mesaSvc.getAll().subscribe()
      })
    })
  }


  public addAlumno(_alumno: Alumno): Observable<Alumno>{
    let crearAlumno = {
      data: {
        Nombre: _alumno.nombre,
        FechaNacimiento: _alumno.fechaNacimiento,
        Email: _alumno.email
      }
    };
    console.log(crearAlumno)
    return this.http.post("/alumnos", crearAlumno).pipe(
      tap(_ => {
        this.getAll().subscribe();
      }),
      catchError( error => {
        console.log("Error creando Alumno");
        throw error;
      })
    );
    /*return this.http.post("/alumnos", _alumno).pipe(tap(_=>{
      this.getAll().subscribe();
    }))*/
  }


  public deleteAlumno(alumno: Alumno): Observable<Alumno>{
    return new Observable<Alumno>(obs=>{
      this.http.delete(`/alumnos/${alumno.id}`).subscribe(_=>{
        this.getAll().subscribe(_=>{
          obs.next(alumno);
        });
      });
    });
  }


}