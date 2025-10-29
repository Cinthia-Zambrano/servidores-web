import { ReporteId } from '../value-objects/ReporteId';
import { Estado } from '../value-objects/Estado';
import { Ubicacion } from '../value-objects/Ubicacion';
/**
 * Entidad principal del dominio: Reporte de Infraestructura
 */
export declare class Reporte {
    private readonly _id;
    private readonly _idUsuario;
    private _titulo;
    private _descripcion;
    private _ubicacion;
    private _estado;
    private readonly _fechaCreacion;
    private _fechaActualizacion;
    constructor(idUsuario: string, titulo: string, descripcion: string, ubicacion: Ubicacion, estado?: Estado, id?: ReporteId);
    get id(): ReporteId;
    get idUsuario(): string;
    get titulo(): string;
    get descripcion(): string;
    get ubicacion(): Ubicacion;
    get estado(): Estado;
    get fechaCreacion(): Date;
    get fechaActualizacion(): Date;
    actualizarTitulo(nuevoTitulo: string): void;
    actualizarDescripcion(nuevaDescripcion: string): void;
    actualizarUbicacion(nuevaUbicacion: Ubicacion): void;
    cambiarEstado(nuevoEstado: Estado): void;
    puedeSerEliminado(): boolean;
    private validarDatosIniciales;
    private validarTitulo;
    private validarDescripcion;
    private validarCambioEstado;
    private actualizarFecha;
    toJSON(): any;
}
