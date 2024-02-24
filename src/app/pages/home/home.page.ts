import { Component } from '@angular/core';
import { MesaService } from 'src/app/core/services/api/mesa.service';
import { Mesa } from 'src/app/core/interfaces/mesa';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalSelectionComponent } from 'src/app/shared/components/modal-selection/modal-selection.component';
import { BehaviorSubject } from 'rxjs';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public mesas: MesaService,
    private modal: ModalController,
    private screen: ScreenOrientation
  ) {}

  //TODO: añadir loading

  ngOnInit(): void{
    this.mesas.getAll().subscribe()
    this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE)
  }

  recargarMesas(){
    this.mesas.actualizarPosicionesMesas();
  }

  crearMesa() {
    this.presentForm(null, (info: any) => {
      if (info.role === 'ok') {
        const nuevaMesa: Mesa = {
          nombre: info.data.nombre,
          id: "0",
          posicion: { x: 100, y: 100 },
          AlumnoID: 0
        };
        console.log('Nueva Mesa:', nuevaMesa);
        this.mesas.addMesa(nuevaMesa).subscribe({
          next: mesaCreada => {
            console.log('Mesa creada:', mesaCreada);
          },
          error: err => console.error('Error al crear mesa:', err)
        });
      }
    });
  }

  public async mesaClick(mesa: Mesa){
    console.log("Mesa clickeado ", JSON.stringify(mesa));
    var onDismiss = (info:any) => {
      console.log(info);
      const nuevaMesa: any = {
        nombre: info.data.nombre,
        id: mesa.id,
        posicion: {
          x: mesa.posicion.x,
          y: mesa.posicion.y
        },
        AlumnoID: info.data.alumnoId
      }
      if (nuevaMesa.AlumnoID !== 0) {
        nuevaMesa.NombreAlumno = info.data.alumnoId.nombre;
      }
      console.log(nuevaMesa)
      switch(info.role){
        case 'ok': {
          this.mesas.updateMesa(nuevaMesa).subscribe()
        }
        break;
        case 'delete': {
          this.mesas.deleteMesa(nuevaMesa).subscribe()
        }
      }
    }
    this.presentForm(mesa, onDismiss)
  }

  async presentForm(data: Mesa | null, onDismiss:(result:any)=>void){
    console.log("Datos del present form "+JSON.stringify(data))
    const modal = await this.modal.create({
      component: ModalSelectionComponent,
      componentProps:{
        mesa: data
      },
      cssClass:"modal-selector"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }
}
