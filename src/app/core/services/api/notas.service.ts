import { Injectable } from '@angular/core';
import { Nota } from '../../interfaces/nota';
import { BehaviorSubject, Observable, from, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
// Lista de las mesas que hay
private _notas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
notas$: Observable<any[]> = this._notas.asObservable();

constructor(
  private firebaseSvc: FirebaseService
) { }

// ---------Métodos---------


public getNotasPorAlumno(alumnoId: any): Observable<any[]> {
  console.log("Obteniendo notas para el alumno con ID:", alumnoId);

  return from(this.firebaseSvc.getDocumentsBy('notas', 'alumnoFK', alumnoId)).pipe(
    tap(documents => {
      console.log("Documentos obtenidos:", documents);
    }),
    map((documents: any[]) => {
      console.log("Mapeando documentos...");
      return documents.map((doc: any) => {
        console.log("Procesando documento:", doc);
        return {
          id: doc.id,
          calificacion: doc.data.calificacion,
          fecha: doc.data.fecha,
          descripcion: doc.data.descripcion,
          asignatura: doc.data.asignatura,
          alumnoID: doc.data.alumnoFK,
        };
      });
    }),
    tap(notas => {
      console.log("Notas obtenidas:", notas);
      this._notas.next(notas);
      console.log("Notas emitidas al BehaviorSubject.");
    })
  );
}



public addNota(nota: any): Observable<Nota> {
  var _nota = {
    calificacion: nota.calificacion,
    fecha: nota.fecha,
    asignatura: nota.asignatura,
    descripcion: nota.descripcion,
    alumnoFK: nota.alumnoId
  };

  return from(this.firebaseSvc.createDocument('notas', _nota)).pipe(
    switchMap((docId: string) => {
      // Una vez que se ha creado el documento en la base de datos,
      // devolvemos el objeto Nota con su ID asignado
      return of({
        id: docId,
        ...nota
      });
    }),
    tap(_ => {
      this.getNotasPorAlumno(nota.alumnoId).subscribe(); // Actualizar notas por alumno
    })
  );
}


public updateNota(nota: any): Observable<any> {
  let actualizarNota = {
    calificacion: nota.calificacion,
    fecha: nota.fecha,
    asignatura: nota.asignatura,
    descripcion: nota.descripcion
  };

  return new Observable<any>(obs => {
    this.firebaseSvc.updateDocument('notas', nota.id, actualizarNota).then(() => {
      obs.next(nota);
      this.getNotasPorAlumno(nota.alumnoId).subscribe(); // Actualizar notas por alumno
    }).catch(error => {
      obs.error(error);
    });
  });
}


public deleteNota(nota: any): Observable<Nota[]> {
  console.log("Eliminar nota " + JSON.stringify(nota))
  return new Observable<any>(obs => {
    this.firebaseSvc.deleteDocument('notas', nota.id).then(() => {
      this.getNotasPorAlumno(nota.alumnoID).subscribe(notasNuevas => {
        obs.next(notasNuevas);
      });
    }).catch(error => {
      obs.error(error);
    });
  });
}

}
