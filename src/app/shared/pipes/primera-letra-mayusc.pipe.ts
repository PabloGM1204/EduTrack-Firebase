import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeraLetraMayusc'
})
export class PrimeraLetraMayuscPipe implements PipeTransform {

  // Metodo que recibe un string y pone la primera letra en mayuscula
  transform(text: string | undefined): string {
    if (!text) {
      return "";
    }
  
    // Divide la cadena en palabras utilizando espacios en blanco como referencia para dividir
    const palabra = text.split(' ');
  
    // Pone en mayusculas la primera letra de cada palabra
    const mayusPalabra = palabra.map(palabra => {
      if (palabra.length > 0) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      } else {
        return "";
      }
    });
  
    // Une las palabras capitalizadas de nuevo en una cadena
    const result = mayusPalabra.join(' ');
  
    return result;
  }

}
