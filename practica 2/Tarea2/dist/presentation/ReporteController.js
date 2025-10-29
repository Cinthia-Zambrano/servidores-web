"use strict";
/**
 * Capa de presentación - Controlador de Reportes
 * Maneja la interacción con el usuario y coordina las operaciones
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteController = void 0;
/**
 * Controlador para la gestión de reportes de infraestructura
 */
class ReporteController {
    constructor(reporteService) {
        this.reporteService = reporteService;
    }
    /**
     * Endpoint simulado para crear un reporte
     */
    async crearReporte(datos) {
        return new Promise((resolve) => {
            this.reporteService.crearReporte(datos, (error, reporte) => {
                if (error) {
                    resolve({ success: false, error: error.message });
                }
                else if (reporte) {
                    resolve({ success: true, data: reporte });
                }
                else {
                    resolve({ success: false, error: 'Error desconocido' });
                }
            });
        });
    }
    /**
     * Endpoint simulado para actualizar un reporte
     */
    async actualizarReporte(id, datos) {
        try {
            const reporte = await this.reporteService.actualizarReporte(id, datos);
            return { success: true, data: reporte };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Endpoint simulado para obtener un reporte por ID
     */
    async obtenerReporte(id) {
        try {
            const reporte = await this.reporteService.obtenerReportePorId(id);
            if (reporte) {
                return { success: true, data: reporte };
            }
            else {
                return { success: false, error: 'Reporte no encontrado' };
            }
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Endpoint simulado para obtener todos los reportes
     */
    async obtenerTodosLosReportes() {
        try {
            const reportes = await this.reporteService.obtenerTodosLosReportes();
            return { success: true, data: reportes };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Endpoint simulado para obtener reportes por estado
     */
    async obtenerReportesPorEstado(estado) {
        try {
            const reportes = await this.reporteService.obtenerReportesPorEstado(estado);
            return { success: true, data: reportes };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Endpoint simulado para eliminar un reporte
     */
    async eliminarReporte(id) {
        try {
            const eliminado = await this.reporteService.eliminarReporte(id);
            return { success: eliminado };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    /**
     * Endpoint simulado para obtener estadísticas
     */
    async obtenerEstadisticas() {
        try {
            const estadisticas = await this.reporteService.obtenerEstadisticas();
            return { success: true, data: estadisticas };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
exports.ReporteController = ReporteController;
