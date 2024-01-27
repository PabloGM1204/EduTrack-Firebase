import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Mesa } from 'src/app/core/interfaces/mesa';
import { MesaService } from 'src/app/core/services/api/mesa.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.scss'],
})
export class MesaComponent  implements OnInit {

  seEstaMoviendo = false;

  @Input() mesa: Mesa | null = null;

  @Output() mesaClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private mesaService: MesaService
  ) { }

  ngOnInit() {}

  onDragStarted(event: any){
    this.seEstaMoviendo = true;
    console.log("Started"+this.seEstaMoviendo)
  }

  // Al soltar el arrastre de la mesa
  dragEnded(event: CdkDragEnd) {
    console.log("Soltado");
    // Recojo el elemento DOM que ha sido arrastrado ya que el getRootElement es método de drag and drop de angular, que es el elemento que ha sido arrastrado,
    // es decir recoje el elemento HTML que ha sido arrastrado
    const element = event.source.getRootElement();
    // Método del DOM en JavaScript que devuelve datos como la posición o el tamaño del objeto(Relativo al viewport)
    // la variable acaba teniendo todos los datos de posición del objeto
    const boundingClientRect = element.getBoundingClientRect();
    
    // Me aseguro de que la posición del apdre tenga valores ya que al hacer calculos con estos datos y al tener el tps en modo estricto me pide que me asegure de que los datos no sean nulos
    let parentPosition = { left: 0, top: 0 };
    // Comprobamos que el elemento padre tenga un padre, lo compruebo ya que el ts me obliga por si se da el caso de que no tenga un elemento padre
    if (element.parentElement) {
      // Guarda la posición del padre real para poder restar la diferencia entre el elemento padre(div mesas) y poder posicionarlo correctamente
      parentPosition = this.getPosition(element.parentElement);
    }
  
    // Hacemos la resta del elemento arrastrado menos la posición del padre para obtener la posición teniendo en cuenta el contenedor padre
    const newPosition = {
      x: boundingClientRect.x - parentPosition.left,
      y: boundingClientRect.y - parentPosition.top
    };
  
    // Compruebo de que mesa tiene valores y no esta undefined para poder actualizar los datos de la posición y guardarlos en el servidor
    if (this.mesa && this.mesa.id !== undefined) {
      // Creo una nueva mesa con los valores de la mesa que hemos clickeado y le doy los valores de posición que hemos calculado antes
      const updatedMesa = { ...this.mesa, posicion: newPosition };
      // Actualizo con el servicio los valores de la mesa
      this.mesaService.updateMesa(updatedMesa).subscribe({
        // En el caso de que todo vaya bien
        next: (res) => console.log('Mesa actualizada con éxito', res),
        // Si da algun error
        error: (err) => console.error('Error al actualizar la mesa', err)
      });
    }
    setTimeout(() => {
      this.seEstaMoviendo = false;
      console.log("Ended"+this.seEstaMoviendo)

    }, 100)
  }

  // Método para obtener la posición del elemento padre con respecto al viewPort, recibe el elemento padre al elementro arrastrado
  private getPosition(el: HTMLElement): { top: number; left: number; } {
    // Inicializo las variables de posición a 0
    let x = 0;
    let y = 0;
    // El bucle se realizara mientras el exista y tanto la distancia horizontal como la vertical sean números válidos
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      // Se suma la distancia horizontal (offsetLeft) del elemento actual a su contenedor padre (body), y se resta cualquier desplazamiento horizontal (scrollLeft) que pueda haber dentro del elemento. Esto da la posición horizontal del elemento relativa a su contenedor padre
      x += el.offsetLeft - el.scrollLeft;
      // Se suma la distancia vertical (offsetTop) y se resta el desplazamiento vertical (scrollTop), añadiendo un ajuste de 2.75 ya que si no baja un poco por un hueco que hay encima del padre
      y += el.offsetTop - el.scrollTop;
      // Convertira "el" en un elemento null cuando no lo detecte
      el = el.offsetParent as HTMLElement;
    }
    // Devuelve el valor top y left que son la posicion absoluta de elemento "el"
    return { top: y, left: x };
  }


  mesaClick(){
    console.log("Click"+this.seEstaMoviendo)
    if(!this.seEstaMoviendo){
      this.mesaClicked.emit();
    }
  }
}
