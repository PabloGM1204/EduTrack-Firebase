import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { Mesa } from '../../interfaces/mesa';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { AlumnoService } from './alumno.service';
import { Unsubscribe } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class MesaService {

  // Lista de las mesas que hay
  private _mesas: BehaviorSubject<Mesa[]> = new BehaviorSubject<Mesa[]>([]);
  mesas$: Observable<Mesa[]> = this._mesas.asObservable();

  constructor(
    private firebaseSvc: FirebaseService
  ) { }

  // ---------Métodos---------

  public getAll(): Observable<Mesa[]> {
    return from(this.firebaseSvc.getDocuments('mesas')).pipe(
        switchMap((documents: any[]) => {
            const mesaObservables: Observable<Mesa>[] = documents.map(document => {
                const mesa: any = {
                    id: document.id,
                    nombre: document.data.NombreMesa,
                    posicion: document.data.posicion,
                    AlumnoID: document.data.AlumnoID,
                    NombreAlumno: ""
                };
                
                // Verificar si hay un alumno asociado y obtener su nombre si es necesario
                if (mesa.AlumnoID !== 0) {
                    return from(this.firebaseSvc.getDocument('alumnos', mesa.AlumnoID)).pipe(
                        map((alumno: any) => {
                          console.log("Datos del alumno para la mesa "+ JSON.stringify(alumno))
                            mesa.NombreAlumno = alumno.data.nombre;
                            return mesa;
                        })
                    );
                } else {
                    return of(mesa);
                }
            });

            // Unir todas las observables de mesas en un solo observable
            return forkJoin(mesaObservables);
        }),
        tap(mesas => {
            console.log('Datos devueltos:', mesas);
            this._mesas.next(mesas);
        }),
        catchError(error => {
            console.error('Error al obtener las mesas:', error);
            return throwError(error);
        })
    );
}

public subscribeToMesasCollection(): Unsubscribe | null {
  return this.firebaseSvc.subscribeToCollection('mesas', this._mesas, (snapshot: any) => {
    const data = snapshot.data();
      return {
          id: snapshot.id,
          nombre: data.NombreMesa,
          posicion: data.posicion,
          AlumnoID: data.AlumnoID,
          NombreAlumno: ""
      };
  });
}


  /*public getMesa(id: number): Observable<Mesa>{
    return this.http.get(environment.ApiStrapiUrl+`/mesas/${id}`);
  }*/

  public updateMesa(mesa: Mesa): Observable<void> {
    console.log("Recibo mesa: "+mesa.posicion)
    let actualizarMesa = {
      NombreMesa: mesa.nombre,
      posicion: mesa.posicion,
      AlumnoID: mesa.AlumnoID !== undefined ? mesa.AlumnoID : "0" // Comprueba si el id es distinto undefined, si True pone el id si es False lo pone a null
    }
    return from(this.firebaseSvc.updateDocument('mesas', mesa.id, actualizarMesa)).pipe(
      tap(_ => {
        this.getAll().subscribe();
      })
    );
    
  }

  actualizarPosicionesMesas(): void {
    // Copio el array que tengo de mesas, con el .map y copio los valores de cada mesa solo que le cambio la posición
    const mesasActualizadas = this._mesas.value.map(mesa => ({
      ...mesa,
      posicion: { x: 0, y: 0 }
    }));
    console.log("Poner visible")
    // Actualizamos todos las subscripciones
    this._mesas.next(mesasActualizadas);
  }


  public addMesa(mesa: Mesa): Observable<Mesa>{
    var _mesa = {
      NombreMesa: mesa.nombre,
      posicion: {
        x: mesa.posicion.x,
        y: mesa.posicion.y
      },
      AlumnoID: mesa.AlumnoID,
    };
  
    return from(this.firebaseSvc.createDocument('mesas', _mesa)).pipe(
      map((uuid: string) => {
        // Una vez que se ha creado el documento en la base de datos,
        // devolvemos el objeto Mesa con su ID asignado
        return {
          ...mesa,
          uuid
        };
      }),
      tap(_ => {
        this.getAll().subscribe();
      })
    );
  }

  public deleteMesa(mesa: Mesa): Observable<Mesa>{
    return new Observable<Mesa> (obs => {from(this.firebaseSvc.deleteDocument('mesas', mesa.id)).subscribe(_ => {
      this.getAll().subscribe(_ => {
        obs.next(mesa)
      })
    })})
  }


}
