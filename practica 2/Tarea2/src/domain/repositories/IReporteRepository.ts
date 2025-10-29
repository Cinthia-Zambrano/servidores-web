import { Reporte } from '../entities/Reporte';
import { ReporteId } from '../value-objects/ReporteId';
import { EstadoReporte } from '../value-objects/Estado';


// Interfaz del repositorio de reportes
// Define el contrato para la persistencia de reportes (CRUD)
// Permite desacoplar la lógica de negocio de la infraestructura
export interface IReporteRepository {
  
  /**
   * CREATE (Callback): crea un nuevo reporte usando patrón callback
   * @param reporte - El reporte a crear
   * @param callback - Función callback (error, resultado)
   */
  crear(
    reporte: Reporte, 
    callback: (error: Error | null, resultado?: Reporte) => void
  ): void;

  /**
   * UPDATE (Promise): actualiza un reporte existente usando Promises
   * @param id - ID del reporte a actualizar
   * @param datosActualizacion - Datos parciales para actualizar
   * @returns Promise que resuelve con el reporte actualizado
   */
  actualizar(
    id: ReporteId, 
    datosActualizacion: Partial<{
      titulo: string;
      descripcion: string;
      ubicacion: any;
      estado: EstadoReporte;
    }>
  ): Promise<Reporte>;

  /**
   * READ (Async/Await): obtiene un reporte por su ID
   * @param id - ID del reporte a buscar
   * @returns Promise que resuelve con el reporte encontrado o null
   */
  obtenerPorId(id: ReporteId): Promise<Reporte | null>;

  /**
   * READ (Async/Await): obtiene todos los reportes
   * @returns Promise que resuelve con array de reportes
   */
  obtenerTodos(): Promise<Reporte[]>;

  /**
   * READ (Async/Await): obtiene reportes por estado
   * @param estado - Estado a filtrar
   * @returns Promise que resuelve con array de reportes filtrados
   */
  obtenerPorEstado(estado: EstadoReporte): Promise<Reporte[]>;

  /**
   * READ (Async/Await): obtiene reportes por usuario
   * @param idUsuario - ID del usuario
   * @returns Promise que resuelve con array de reportes del usuario
   */
  obtenerPorUsuario(idUsuario: string): Promise<Reporte[]>;

  /**
   * DELETE (Async/Await): elimina un reporte por su ID
   * @param id - ID del reporte a eliminar
   * @returns Promise que resuelve con boolean indicando éxito
   */
  eliminar(id: ReporteId): Promise<boolean>;

  /**
   * Método auxiliar: obtiene el conteo total de reportes
   * @returns Promise que resuelve con el número total de reportes
   */
  contarReportes(): Promise<number>;
}