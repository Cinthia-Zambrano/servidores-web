
// Capa de presentación: Controlador de Reportes
// Simula endpoints y coordina la interacción entre usuario y lógica de aplicación
import { ReporteService, CrearReporteDTO, ActualizarReporteDTO, ReporteResponseDTO } from '../application/services/ReporteService';
import { EstadoReporte } from '../domain/value-objects/Estado';

// Controlador para la gestión de reportes de infraestructura
// Aquí se simulan los endpoints típicos de una API REST
export class ReporteController {
  // El servicio de reportes se inyecta por constructor
  constructor(private readonly reporteService: ReporteService) {}

  /**
   * Simula endpoint para crear un reporte
   * Usa callback y devuelve un objeto con éxito o error
   */
  async crearReporte(datos: CrearReporteDTO): Promise<{ success: boolean; data?: ReporteResponseDTO; error?: string }> {
    return new Promise((resolve) => {
      this.reporteService.crearReporte(datos, (error, reporte) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else if (reporte) {
          resolve({ success: true, data: reporte });
        } else {
          resolve({ success: false, error: 'Error desconocido' });
        }
      });
    });
  }


  /**
   * Simula endpoint para actualizar un reporte
   * Usa promesa y devuelve el resultado o error
   */
  async actualizarReporte(id: string, datos: ActualizarReporteDTO): Promise<{ success: boolean; data?: ReporteResponseDTO; error?: string }> {
    try {
      const reporte = await this.reporteService.actualizarReporte(id, datos);
      return { success: true, data: reporte };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }


  /**
   * Simula endpoint para obtener un reporte por ID
   */
  async obtenerReporte(id: string): Promise<{ success: boolean; data?: ReporteResponseDTO; error?: string }> {
    try {
      const reporte = await this.reporteService.obtenerReportePorId(id);
      if (reporte) {
        return { success: true, data: reporte };
      } else {
        return { success: false, error: 'Reporte no encontrado' };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }


  /**
   * Simula endpoint para obtener todos los reportes
   */
  async obtenerTodosLosReportes(): Promise<{ success: boolean; data?: ReporteResponseDTO[]; error?: string }> {
    try {
      const reportes = await this.reporteService.obtenerTodosLosReportes();
      return { success: true, data: reportes };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }


  /**
   * Simula endpoint para obtener reportes por estado
   */
  async obtenerReportesPorEstado(estado: EstadoReporte): Promise<{ success: boolean; data?: ReporteResponseDTO[]; error?: string }> {
    try {
      const reportes = await this.reporteService.obtenerReportesPorEstado(estado);
      return { success: true, data: reportes };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }


  /**
   * Simula endpoint para eliminar un reporte
   */
  async eliminarReporte(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const eliminado = await this.reporteService.eliminarReporte(id);
      return { success: eliminado };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Simula endpoint para obtener estadísticas
   */
  async obtenerEstadisticas(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const estadisticas = await this.reporteService.obtenerEstadisticas();
      return { success: true, data: estadisticas };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}