export interface Mesa {
    id: number,
    nombre: string,
    posicion: {
        x: number;
        y: number;
    };
    AlumnoID: number,
    AlumnoNombre?: string
}
