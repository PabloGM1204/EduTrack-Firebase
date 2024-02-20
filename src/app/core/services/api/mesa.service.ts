import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { Mesa } from '../../interfaces/mesa';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { FirebaseDocument, FirebaseService } from '../firebase/firebase.service';
import { AlumnoService } from './alumno.service';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  // Lista de las mesas que hay
  private _mesas: BehaviorSubject<Mesa[]> = new BehaviorSubject<Mesa[]>([]);
  mesas$: Observable<Mesa[]> = this._mesas.asObservable();

  constructor(
    private firebaseSvc: FirebaseService,
  ) { }

  // ---------Métodos---------

  public getAll(): Observable<Mesa[]> {
    return from(this.firebaseSvc.getDocuments('mesas')).pipe(
      map((documents: any[]) => {
        console.log(documents)
        // Mapeamos los documentos de Firebase a objetos Mesa
        return documents.map(document => ({
          id: document.id,
          nombre: document.data.NombreMesa,
          posicion: document.data.posicion,
          AlumnoID: document.data.alumnoFK == 0 ? 0 : document.data.alumnoFK.id,
          AlumnoNombre: document.data.alumnoFK == 0 ? "" : document.data.alumnoFK.nombre
        }));
      }),
      tap(data => {
        console.log('Datos devueltos:', data),
        this._mesas.next(data)
      })
    );
  }

  /*public getMesa(id: number): Observable<Mesa>{
    return this.http.get(environment.ApiStrapiUrl+`/mesas/${id}`);
  }*/

  public updateMesa(mesa: Mesa): Observable<void> {
    console.log("Recibo mesa: "+mesa.posicion)
    let actualizarMesa = {
      NombreMesa: mesa.nombre,
      posicion: mesa.posicion,
      alumnoFK: mesa.AlumnoID !== undefined ? mesa.AlumnoID : null // Comprueba si el id es distinto undefined, si True pone el id si es False lo pone a null
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
