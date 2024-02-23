export interface Nota{
    id: string,
    calificacion: number,
    fecha: string,
    descripcion: string,
    asignatura: string,
    alumnoId: number,
    alumnoNombre?: string,
    foto?: any
}