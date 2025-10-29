import { ReporteId } from '../value-objects/ReporteId';
import { Estado, EstadoReporte } from '../value-objects/Estado';
import { Ubicacion } from '../value-objects/Ubicacion';


// Entidad principal del dominio: representa un reporte de infraestructura
// Contiene toda la lógica y validaciones de negocio relacionadas a un reporte
export class Reporte {
  // Identificador único del reporte
  private readonly _id: ReporteId;
  // Usuario que creó el reporte
  private readonly _idUsuario: string;
  // Título del reporte
  private _titulo: string;
  // Descripción del problema
  private _descripcion: string;
  // Ubicación asociada
  private _ubicacion: Ubicacion;
  // Estado del reporte (pendiente, resuelto, etc.)
  private _estado: Estado;
  // Fechas de creación y actualización
  private readonly _fechaCreacion: Date;
  private _fechaActualizacion: Date;

  constructor(
    idUsuario: string,
    titulo: string,
    descripcion: string,
    ubicacion: Ubicacion,
    estado: Estado = new Estado(EstadoReporte.PENDIENTE),
    id?: ReporteId
  ) {
    // Validaciones de datos iniciales
    this.validarDatosIniciales(idUsuario, titulo, descripcion);
    this._id = id || ReporteId.generar();
    this._idUsuario = idUsuario;
    this._titulo = titulo.trim();
    this._descripcion = descripcion.trim();
    this._ubicacion = ubicacion;
    this._estado = estado;
    this._fechaCreacion = new Date();
    this._fechaActualizacion = new Date();
  }


  // Getters para acceder a los atributos privados
  get id(): ReporteId {
    return this._id;
  }
  get idUsuario(): string {
    return this._idUsuario;
  }
  get titulo(): string {
    return this._titulo;
  }
  get descripcion(): string {
    return this._descripcion;
  }
  get ubicacion(): Ubicacion {
    return this._ubicacion;
  }
  get estado(): Estado {
    return this._estado;
  }
  get fechaCreacion(): Date {
    return this._fechaCreacion;
  }
  get fechaActualizacion(): Date {
    return this._fechaActualizacion;
  }


  // Métodos de negocio para modificar el reporte
  actualizarTitulo(nuevoTitulo: string): void {
    this.validarTitulo(nuevoTitulo);
    this._titulo = nuevoTitulo.trim();
    this.actualizarFecha();
  }
  actualizarDescripcion(nuevaDescripcion: string): void {
    this.validarDescripcion(nuevaDescripcion);
    this._descripcion = nuevaDescripcion.trim();
    this.actualizarFecha();
  }
  actualizarUbicacion(nuevaUbicacion: Ubicacion): void {
    this._ubicacion = nuevaUbicacion;
    this.actualizarFecha();
  }
  cambiarEstado(nuevoEstado: Estado): void {
    this.validarCambioEstado(nuevoEstado);
    this._estado = nuevoEstado;
    this.actualizarFecha();
  }
  // Permite saber si el reporte puede ser eliminado según su estado
  puedeSerEliminado(): boolean {
    return this._estado.valor === EstadoReporte.PENDIENTE || 
           this._estado.valor === EstadoReporte.RECHAZADO ||
           this._estado.valor === EstadoReporte.CERRADO;
  }

  // Validaciones privadas para asegurar la integridad del reporte
  private validarDatosIniciales(idUsuario: string, titulo: string, descripcion: string): void {
    if (!idUsuario || idUsuario.trim().length === 0) {
      throw new Error('ID de usuario es requerido');
    }
    this.validarTitulo(titulo);
    this.validarDescripcion(descripcion);
  }
  private validarTitulo(titulo: string): void {
    if (!titulo || titulo.trim().length < 5) {
      throw new Error('El título debe tener al menos 5 caracteres');
    }
    if (titulo.trim().length > 100) {
      throw new Error('El título no puede exceder 100 caracteres');
    }
  }
  private validarDescripcion(descripcion: string): void {
    if (!descripcion || descripcion.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }
    if (descripcion.trim().length > 1000) {
      throw new Error('La descripción no puede exceder 1000 caracteres');
    }
  }

  private validarCambioEstado(nuevoEstado: Estado): void {
    const transicionesValidas: Record<EstadoReporte, EstadoReporte[]> = {
      [EstadoReporte.PENDIENTE]: [EstadoReporte.EN_REVISION, EstadoReporte.RECHAZADO],
      [EstadoReporte.EN_REVISION]: [EstadoReporte.EN_PROCESO, EstadoReporte.RECHAZADO, EstadoReporte.PENDIENTE],
      [EstadoReporte.EN_PROCESO]: [EstadoReporte.RESUELTO, EstadoReporte.EN_REVISION],
      [EstadoReporte.RESUELTO]: [EstadoReporte.CERRADO, EstadoReporte.EN_PROCESO],
      [EstadoReporte.CERRADO]: [],
      [EstadoReporte.RECHAZADO]: [EstadoReporte.PENDIENTE]
    };

    const estadosPermitidos = transicionesValidas[this._estado.valor];
    if (!estadosPermitidos.includes(nuevoEstado.valor)) {
      throw new Error(
        `No se puede cambiar el estado de ${this._estado.valor} a ${nuevoEstado.valor}`
      );
    }
  }

  private actualizarFecha(): void {
    this._fechaActualizacion = new Date();
  }

  // Método de utilidad para serialización
  toJSON(): any {
    return {
      id: this._id.valor,
      idUsuario: this._idUsuario,
      titulo: this._titulo,
      descripcion: this._descripcion,
      ubicacion: {
        direccion: this._ubicacion.direccion,
        ciudad: this._ubicacion.ciudad,
        coordenadas: this._ubicacion.coordenadas
      },
      estado: this._estado.valor,
      fechaCreacion: this._fechaCreacion.toISOString(),
      fechaActualizacion: this._fechaActualizacion.toISOString()
    };
  }
}