export interface Mesa {
    id: string,
    nombre: string,
    posicion: {
        x: number;
        y: number;
    };
    AlumnoID: number,
    AlumnoNombre?: string
}
