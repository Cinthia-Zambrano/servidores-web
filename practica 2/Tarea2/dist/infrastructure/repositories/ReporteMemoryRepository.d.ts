import { IReporteRepository } from '../../domain/repositories/IReporteRepository';
import { Reporte } from '../../domain/entities/Reporte';
import { ReporteId } from '../../domain/value-objects/ReporteId';
import { EstadoReporte } from '../../domain/value-objects/Estado';
/**
 * Implementación en memoria del repositorio de reportes
 * Aplica diferentes paradigmas asíncronos según la operación CRUD
 */
export declare class ReporteMemoryRepository implements IReporteRepository {
    private reportes;
    private readonly latenciaRed;
    constructor();
    /**
     * CALLBACK PATTERN - CREATE OPERATION
     * Simula latencia de red y usa patrón callback tradicional
     */
    crear(reporte: Reporte, callback: (error: Error | null, resultado?: Reporte) => void): void;
    /**
     * PROMISE PATTERN - UPDATE OPERATION
     * Usa Promises con .then() y .catch() para actualización
     */
    actualizar(id: ReporteId, datosActualizacion: Partial<{
        titulo: string;
        descripcion: string;
        ubicacion: any;
        estado: EstadoReporte;
    }>): Promise<Reporte>;
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Individual)
     * Obtiene un reporte específico por ID
     */
    obtenerPorId(id: ReporteId): Promise<Reporte | null>;
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Listado completo)
     * Obtiene todos los reportes
     */
    obtenerTodos(): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Filtrado por estado)
     */
    obtenerPorEstado(estado: EstadoReporte): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Filtrado por usuario)
     */
    obtenerPorUsuario(idUsuario: string): Promise<Reporte[]>;
    /**
     * ASYNC/AWAIT PATTERN - DELETE OPERATION
     * Elimina un reporte con validaciones de negocio
     */
    eliminar(id: ReporteId): Promise<boolean>;
    /**
     * Método auxiliar para contar reportes
     */
    contarReportes(): Promise<number>;
    /**
     * Método privado para simular latencia de red
     */
    private simularLatencia;
    /**
     * Inicializa datos de prueba realistas (mínimo 10 registros)
     */
    private inicializarDatosPrueba;
}
