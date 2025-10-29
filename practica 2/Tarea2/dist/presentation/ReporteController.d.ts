/**
 * Capa de presentación - Controlador de Reportes
 * Maneja la interacción con el usuario y coordina las operaciones
 */
import { ReporteService, CrearReporteDTO, ActualizarReporteDTO, ReporteResponseDTO } from '../application/services/ReporteService';
import { EstadoReporte } from '../domain/value-objects/Estado';
/**
 * Controlador para la gestión de reportes de infraestructura
 */
export declare class ReporteController {
    private readonly reporteService;
    constructor(reporteService: ReporteService);
    /**
     * Endpoint simulado para crear un reporte
     */
    crearReporte(datos: CrearReporteDTO): Promise<{
        success: boolean;
        data?: ReporteResponseDTO;
        error?: string;
    }>;
    /**
     * Endpoint simulado para actualizar un reporte
     */
    actualizarReporte(id: string, datos: ActualizarReporteDTO): Promise<{
        success: boolean;
        data?: ReporteResponseDTO;
        error?: string;
    }>;
    /**
     * Endpoint simulado para obtener un reporte por ID
     */
    obtenerReporte(id: string): Promise<{
        success: boolean;
        data?: ReporteResponseDTO;
        error?: string;
    }>;
    /**
     * Endpoint simulado para obtener todos los reportes
     */
    obtenerTodosLosReportes(): Promise<{
        success: boolean;
        data?: ReporteResponseDTO[];
        error?: string;
    }>;
    /**
     * Endpoint simulado para obtener reportes por estado
     */
    obtenerReportesPorEstado(estado: EstadoReporte): Promise<{
        success: boolean;
        data?: ReporteResponseDTO[];
        error?: string;
    }>;
    /**
     * Endpoint simulado para eliminar un reporte
     */
    eliminarReporte(id: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Endpoint simulado para obtener estadísticas
     */
    obtenerEstadisticas(): Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }>;
}
