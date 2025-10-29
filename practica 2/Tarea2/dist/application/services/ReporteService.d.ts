import { IReporteRepository } from '../../domain/repositories/IReporteRepository';
import { EstadoReporte } from '../../domain/value-objects/Estado';
/**
 * DTO para crear un nuevo reporte
 */
export interface CrearReporteDTO {
    idUsuario: string;
    titulo: string;
    descripcion: string;
    ubicacion: {
        direccion: string;
        ciudad: string;
        coordenadas?: {
            latitud: number;
            longitud: number;
        };
    };
}
/**
 * DTO para actualizar un reporte existente
 */
export interface ActualizarReporteDTO {
    titulo?: string;
    descripcion?: string;
    ubicacion?: {
        direccion: string;
        ciudad: string;
        coordenadas?: {
            latitud: number;
            longitud: number;
        };
    };
    estado?: EstadoReporte;
}
/**
 * DTO de respuesta con información del reporte
 */
export interface ReporteResponseDTO {
    id: string;
    idUsuario: string;
    titulo: string;
    descripcion: string;
    ubicacion: {
        direccion: string;
        ciudad: string;
        coordenadas?: {
            latitud: number;
            longitud: number;
        };
    };
    estado: EstadoReporte;
    fechaCreacion: string;
    fechaActualizacion: string;
}
/**
 * Servicio de aplicación para operaciones de reportes
 * Orquesta las operaciones del dominio y maneja la lógica de aplicación
 */
export declare class ReporteService {
    private readonly reporteRepository;
    constructor(reporteRepository: IReporteRepository);
    /**
     * Crear un nuevo reporte usando CALLBACK PATTERN
     */
    crearReporte(datos: CrearReporteDTO, callback: (error: Error | null, reporte?: ReporteResponseDTO) => void): void;
    /**
     * Actualizar un reporte existente usando PROMISE PATTERN
     */
    actualizarReporte(id: string, datos: ActualizarReporteDTO): Promise<ReporteResponseDTO>;
    /**
     * Obtener un reporte por ID usando ASYNC/AWAIT PATTERN
     */
    obtenerReportePorId(id: string): Promise<ReporteResponseDTO | null>;
    /**
     * Obtener todos los reportes usando ASYNC/AWAIT PATTERN
     */
    obtenerTodosLosReportes(): Promise<ReporteResponseDTO[]>;
    /**
     * Obtener reportes por estado usando ASYNC/AWAIT PATTERN
     */
    obtenerReportesPorEstado(estado: EstadoReporte): Promise<ReporteResponseDTO[]>;
    /**
     * Obtener reportes por usuario usando ASYNC/AWAIT PATTERN
     */
    obtenerReportesPorUsuario(idUsuario: string): Promise<ReporteResponseDTO[]>;
    /**
     * Eliminar un reporte usando ASYNC/AWAIT PATTERN
     */
    eliminarReporte(id: string): Promise<boolean>;
    /**
     * Obtener estadísticas de reportes
     */
    obtenerEstadisticas(): Promise<{
        total: number;
        porEstado: Record<EstadoReporte, number>;
    }>;
    /**
     * Validaciones privadas para creación de reportes
     */
    private validarDatosCreacion;
    /**
     * Validaciones privadas para actualización de reportes
     */
    private validarDatosActualizacion;
    /**
     * Convierte una entidad Reporte a DTO de respuesta
     */
    private convertirAResponseDTO;
}
