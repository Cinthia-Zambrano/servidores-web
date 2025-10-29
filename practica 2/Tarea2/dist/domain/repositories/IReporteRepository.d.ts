import { Reporte } from '../entities/Reporte';
import { ReporteId } from '../value-objects/ReporteId';
import { EstadoReporte } from '../value-objects/Estado';
/**
 * Interfaz del repositorio de reportes que define el contrato
 * para las operaciones de persistencia
 */
export interface IReporteRepository {
    /**
     * CALLBACK PATTERN - Operación CREATE
     * Crea un nuevo reporte usando el patrón callback
     * @param reporte - El reporte a crear
     * @param callback - Función callback con patrón (error, resultado)
     */
    crear(reporte: Reporte, callback: (error: Error | null, resultado?: Reporte) => void): void;
    /**
     * PROMISE PATTERN - Operación UPDATE
     * Actualiza un reporte existente usando Promises
     * @param id - ID del reporte a actualizar
     * @param datosActualizacion - Datos parciales para actualizar
     * @returns Promise que resuelve con el reporte actualizado
     */
    actualizar(id: ReporteId, datosActualizacion: Partial<{
        titulo: string;
        descripcion: string;
        ubicacion: any;
        estado: EstadoReporte;
    }>): Promise<Reporte>;
    /**
     * ASYNC/AWAIT PATTERN - Operación READ (individual)
     * Obtiene un reporte por su ID
     * @param id - ID del reporte a buscar
     * @returns Promise que resuelve con el reporte encontrado o null
     */
    obtenerPorId(id: ReporteId): Promise<Reporte | null>;
    /**
     * ASYNC/AWAIT PATTERN - Operación READ (listado)
     * Obtiene todos los reportes
     * @returns Promise que resuelve con array de reportes
     */
    obtenerTodos(): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - Operación READ (filtrado)
     * Obtiene reportes por estado
     * @param estado - Estado a filtrar
     * @returns Promise que resuelve con array de reportes filtrados
     */
    obtenerPorEstado(estado: EstadoReporte): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - Operación READ (filtrado por usuario)
     * Obtiene reportes por usuario
     * @param idUsuario - ID del usuario
     * @returns Promise que resuelve con array de reportes del usuario
     */
    obtenerPorUsuario(idUsuario: string): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - Operación DELETE
     * Elimina un reporte por su ID
     * @param id - ID del reporte a eliminar
     * @returns Promise que resuelve con boolean indicando éxito
     */
    eliminar(id: ReporteId): Promise<boolean>;
    /**
     * Método auxiliar para obtener el conteo total de reportes
     * @returns Promise que resuelve con el número total de reportes
     */
    contarReportes(): Promise<number>;
}
