
// Servicio de aplicación: aquí se orquesta la lógica de negocio y se conecta con el repositorio
import { IReporteRepository } from '../../domain/repositories/IReporteRepository';
import { Reporte } from '../../domain/entities/Reporte';
import { ReporteId } from '../../domain/value-objects/ReporteId';
import { Estado, EstadoReporte } from '../../domain/value-objects/Estado';
import { Ubicacion } from '../../domain/value-objects/Ubicacion';

// DTO para crear un nuevo reporte
// Se usa para recibir datos desde la capa de presentación
export interface CrearReporteDTO {
  idUsuario: string;
  titulo: string;
  descripcion: string;
  ubicacion: {
    direccion: string;
    ciudad: string;
    coordenadas?: { latitud: number; longitud: number };
  };
}

// DTO para actualizar un reporte existente
export interface ActualizarReporteDTO {
  titulo?: string;
  descripcion?: string;
  ubicacion?: {
    direccion: string;
    ciudad: string;
    coordenadas?: { latitud: number; longitud: number };
  };
  estado?: EstadoReporte;
}

// DTO de respuesta: lo que se devuelve al usuario/presentación
export interface ReporteResponseDTO {
  id: string;
  idUsuario: string;
  titulo: string;
  descripcion: string;
  ubicacion: {
    direccion: string;
    ciudad: string;
    coordenadas?: { latitud: number; longitud: number };
  };
  estado: EstadoReporte;
  fechaCreacion: string;
  fechaActualizacion: string;
}


// Servicio de aplicación para operaciones de reportes
// Aquí se orquesta la lógica de negocio y se conecta con el repositorio
export class ReporteService {
  // El repositorio se inyecta por constructor (principio de inversión de dependencias)
  constructor(private readonly reporteRepository: IReporteRepository) {}


  /**
   * Crear un nuevo reporte usando CALLBACK PATTERN
   * Recibe datos, valida, crea entidad y delega al repositorio
   */
  crearReporte(
    datos: CrearReporteDTO,
    callback: (error: Error | null, reporte?: ReporteResponseDTO) => void
  ): void {
    try {
      // Validaciones previas de datos de entrada
      this.validarDatosCreacion(datos);

      // Crear objetos de valor (Ubicación)
      const ubicacion = new Ubicacion(
        datos.ubicacion.direccion,
        datos.ubicacion.ciudad,
        datos.ubicacion.coordenadas
      );

      // Crear entidad del dominio (Reporte)
      const nuevoReporte = new Reporte(
        datos.idUsuario,
        datos.titulo,
        datos.descripcion,
        ubicacion
      );

      // Delegar al repositorio con callback
      this.reporteRepository.crear(nuevoReporte, (error, reporteCreado) => {
        if (error) {
          callback(new Error(`Error al crear reporte: ${error.message}`));
          return;
        }
        if (!reporteCreado) {
          callback(new Error('Error inesperado: No se pudo crear el reporte'));
          return;
        }
        // Convertir a DTO de respuesta
        const responseDTO = this.convertirAResponseDTO(reporteCreado);
        callback(null, responseDTO);
      });
    } catch (error) {
      callback(error as Error);
    }
  }

  /**
   * Actualizar un reporte existente usando PROMISE PATTERN
   * Devuelve una promesa con el resultado
   */
  actualizarReporte(id: string, datos: ActualizarReporteDTO): Promise<ReporteResponseDTO> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validar ID y datos
        const reporteId = new ReporteId(id);
        this.validarDatosActualizacion(datos);
        // Preparar datos para el repositorio
        const datosActualizacion: any = {};

        if (datos.titulo !== undefined) {
          datosActualizacion.titulo = datos.titulo;
        }

        if (datos.descripcion !== undefined) {
          datosActualizacion.descripcion = datos.descripcion;
        }

        if (datos.ubicacion) {
          datosActualizacion.ubicacion = datos.ubicacion;
        }

        if (datos.estado !== undefined) {
          datosActualizacion.estado = datos.estado;
        }

        // Usar patrón Promise con .then() y .catch()
        this.reporteRepository.actualizar(reporteId, datosActualizacion)
          .then(reporteActualizado => {
            const responseDTO = this.convertirAResponseDTO(reporteActualizado);
            resolve(responseDTO);
          })
          .catch(error => {
            reject(new Error(`Error al actualizar reporte: ${error.message}`));
          });

      } catch (error) {
        reject(new Error(`Error de validación: ${(error as Error).message}`));
      }
    });
  }

  /**
   * Obtener un reporte por ID usando ASYNC/AWAIT PATTERN
   */
  async obtenerReportePorId(id: string): Promise<ReporteResponseDTO | null> {
    try {
      const reporteId = new ReporteId(id);
      
      const reporte = await this.reporteRepository.obtenerPorId(reporteId);
      
      if (!reporte) {
        return null;
      }

      return this.convertirAResponseDTO(reporte);
    } catch (error) {
      throw new Error(`Error al obtener reporte: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener todos los reportes usando ASYNC/AWAIT PATTERN
   */
  async obtenerTodosLosReportes(): Promise<ReporteResponseDTO[]> {
    try {
      const reportes = await this.reporteRepository.obtenerTodos();
      
      return reportes.map(reporte => this.convertirAResponseDTO(reporte));
    } catch (error) {
      throw new Error(`Error al obtener reportes: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener reportes por estado usando ASYNC/AWAIT PATTERN
   */
  async obtenerReportesPorEstado(estado: EstadoReporte): Promise<ReporteResponseDTO[]> {
    try {
      // Validar estado
      if (!Object.values(EstadoReporte).includes(estado)) {
        throw new Error(`Estado inválido: ${estado}`);
      }

      const reportes = await this.reporteRepository.obtenerPorEstado(estado);
      
      return reportes.map(reporte => this.convertirAResponseDTO(reporte));
    } catch (error) {
      throw new Error(`Error al obtener reportes por estado: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener reportes por usuario usando ASYNC/AWAIT PATTERN
   */
  async obtenerReportesPorUsuario(idUsuario: string): Promise<ReporteResponseDTO[]> {
    try {
      if (!idUsuario || idUsuario.trim().length === 0) {
        throw new Error('ID de usuario es requerido');
      }

      const reportes = await this.reporteRepository.obtenerPorUsuario(idUsuario);
      
      return reportes.map(reporte => this.convertirAResponseDTO(reporte));
    } catch (error) {
      throw new Error(`Error al obtener reportes por usuario: ${(error as Error).message}`);
    }
  }

  /**
   * Eliminar un reporte usando ASYNC/AWAIT PATTERN
   */
  async eliminarReporte(id: string): Promise<boolean> {
    try {
      const reporteId = new ReporteId(id);
      
      const eliminado = await this.reporteRepository.eliminar(reporteId);
      
      return eliminado;
    } catch (error) {
      throw new Error(`Error al eliminar reporte: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener estadísticas de reportes
   */
  async obtenerEstadisticas(): Promise<{
    total: number;
    porEstado: Record<EstadoReporte, number>;
  }> {
    try {
      const reportes = await this.reporteRepository.obtenerTodos();
      
      const estadisticas = {
        total: reportes.length,
        porEstado: {} as Record<EstadoReporte, number>
      };

      // Inicializar contadores
      Object.values(EstadoReporte).forEach(estado => {
        estadisticas.porEstado[estado] = 0;
      });

      // Contar reportes por estado
      reportes.forEach(reporte => {
        estadisticas.porEstado[reporte.estado.valor]++;
      });

      return estadisticas;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${(error as Error).message}`);
    }
  }

  /**
   * Validaciones privadas para creación de reportes
   */
  private validarDatosCreacion(datos: CrearReporteDTO): void {
    if (!datos.idUsuario || datos.idUsuario.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }

    if (!datos.titulo || datos.titulo.trim().length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (!datos.descripcion || datos.descripcion.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (!datos.ubicacion || !datos.ubicacion.direccion || !datos.ubicacion.ciudad) {
      throw new Error('La ubicación (dirección y ciudad) es requerida');
    }
  }

  /**
   * Validaciones privadas para actualización de reportes
   */
  private validarDatosActualizacion(datos: ActualizarReporteDTO): void {
    if (datos.titulo !== undefined && datos.titulo.trim().length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }

    if (datos.descripcion !== undefined && datos.descripcion.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (datos.estado !== undefined && !Object.values(EstadoReporte).includes(datos.estado)) {
      throw new Error(`Estado inválido: ${datos.estado}`);
    }

    if (datos.ubicacion) {
      if (!datos.ubicacion.direccion || !datos.ubicacion.ciudad) {
        throw new Error('La ubicación debe incluir dirección y ciudad');
      }
    }
  }

  /**
   * Convierte una entidad Reporte a DTO de respuesta
   */
  private convertirAResponseDTO(reporte: Reporte): ReporteResponseDTO {
    return {
      id: reporte.id.valor,
      idUsuario: reporte.idUsuario,
      titulo: reporte.titulo,
      descripcion: reporte.descripcion,
      ubicacion: {
        direccion: reporte.ubicacion.direccion,
        ciudad: reporte.ubicacion.ciudad,
        coordenadas: reporte.ubicacion.coordenadas
      },
      estado: reporte.estado.valor,
      fechaCreacion: reporte.fechaCreacion.toISOString(),
      fechaActualizacion: reporte.fechaActualizacion.toISOString()
    };
  }
}