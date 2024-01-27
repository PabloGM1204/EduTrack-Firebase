import { Injectable } from '@angular/core';
import { Nota } from '../../interfaces/nota';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
// Lista de las mesas que hay
private _notas: BehaviorSubject<Nota[]> = new BehaviorSubject<Nota[]>([]);
notas$: Observable<Nota[]> = this._notas.asObservable();

constructor(
  private http: ApiService
) { }

// ---------Métodos---------

public getAll(): Observable<Nota[]>{
  
  return this.http.get('/notas/?populate=alumnoFK').pipe(map(response => response.data.map((item: { id: any; attributes: {
    alumnoFK: any;
    Asignatura: any; Calificacion: any; Fecha: any; Descripcion: any;
}; }) => ({
    id: item.id,
    calificacion: item.attributes.Calificacion,
    fecha: item.attributes.Fecha,
    descripcion: item.attributes.Descripcion,
    asignatura: item.attributes.Asignatura,
    alumnoID: item.attributes.alumnoFK.data?.id
  }))),
  tap(nota => {
    console.log(nota);
    this._notas.next(nota);
  })
  )
}


public getNotasPorAlumno(alumnoId: number): Observable<Nota[]>{
  return this.http.get(`/notas?filters[alumnoFK][id][$eq]=${alumnoId}&populate=*`).pipe(map(response => response.data.map((item: { id: any; attributes: {
    alumnoFK: any; Asignatura: any; Calificacion: any; Fecha: any; Descripcion: any;
}; }) => ({
    id: item.id,
    calificacion: item.attributes.Calificacion,
    fecha: item.attributes.Fecha,
    descripcion: item.attributes.Descripcion,
    asignatura: item.attributes.Asignatura,
    alumnoID: item.attributes.alumnoFK.data?.id,
    alumnoNombre: item.attributes.alumnoFK.data?.attributes.Nombre
  }))),
  tap(nota => {
    console.log(nota);
    this._notas.next(nota);
  })
  )
}

public addNota(nota: Nota): Observable<Nota>{
  var _nota = {
    data: {
      Calificacion: nota.calificacion,
      Fecha: nota.fecha,
      Asignatura: nota.asignatura,
      Descripcion: nota.descripcion,
      alumnoFK: nota.alumnoId
    }
  };
  return this.http.post("/notas", _nota).pipe(tap(_=>{
    this.getNotasPorAlumno(nota.id).subscribe(); // Mirar para que se actualice
  }))
}

public updateNota(_nota: Nota): Observable<Nota> {
  console.log(_nota.id)
  let actualizarNota = {
    data: {
      Calificacion: _nota.calificacion,
      Fecha: _nota.fecha,
      Asignatura: _nota.asignatura,
      Descripcion: _nota.descripcion,
    }
  }
  return new Observable<Nota>(obs =>{
    this.http.put(`/notas/${_nota.id}`, actualizarNota).subscribe(_=>{
      console.log(_nota)
      obs.next(_nota);
      this.getNotasPorAlumno(_nota.id).subscribe()
    })
  })
}

public deleteNota(nota: Nota): Observable<Nota[]>{
  return new Observable<Nota[]>(obs=>{
    this.http.delete(`/notas/${nota.id}`).subscribe(_=>{
      this.getNotasPorAlumno(nota.id).subscribe(notasNuevas=>{
        obs.next(notasNuevas);
      });
    });
  });
}

}
