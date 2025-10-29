"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteService = void 0;
const Reporte_1 = require("../../domain/entities/Reporte");
const ReporteId_1 = require("../../domain/value-objects/ReporteId");
const Estado_1 = require("../../domain/value-objects/Estado");
const Ubicacion_1 = require("../../domain/value-objects/Ubicacion");
/**
 * Servicio de aplicación para operaciones de reportes
 * Orquesta las operaciones del dominio y maneja la lógica de aplicación
 */
class ReporteService {
    constructor(reporteRepository) {
        this.reporteRepository = reporteRepository;
    }
    /**
     * Crear un nuevo reporte usando CALLBACK PATTERN
     */
    crearReporte(datos, callback) {
        try {
            // Validaciones previas de datos de entrada
            this.validarDatosCreacion(datos);
            // Crear objetos de valor
            const ubicacion = new Ubicacion_1.Ubicacion(datos.ubicacion.direccion, datos.ubicacion.ciudad, datos.ubicacion.coordenadas);
            // Crear entidad del dominio
            const nuevoReporte = new Reporte_1.Reporte(datos.idUsuario, datos.titulo, datos.descripcion, ubicacion);
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
        }
        catch (error) {
            callback(error);
        }
    }
    /**
     * Actualizar un reporte existente usando PROMISE PATTERN
     */
    actualizarReporte(id, datos) {
        return new Promise(async (resolve, reject) => {
            try {
                // Validar ID
                const reporteId = new ReporteId_1.ReporteId(id);
                // Validar datos de actualización
                this.validarDatosActualizacion(datos);
                // Preparar datos para el repositorio
                const datosActualizacion = {};
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
            }
            catch (error) {
                reject(new Error(`Error de validación: ${error.message}`));
            }
        });
    }
    /**
     * Obtener un reporte por ID usando ASYNC/AWAIT PATTERN
     */
    async obtenerReportePorId(id) {
        try {
            const reporteId = new ReporteId_1.ReporteId(id);
            const reporte = await this.reporteRepository.obtenerPorId(reporteId);
            if (!reporte) {
                return null;
            }
            return this.convertirAResponseDTO(reporte);
        }
        catch (error) {
            throw new Error(`Error al obtener reporte: ${error.message}`);
        }
    }
    /**
     * Obtener todos los reportes usando ASYNC/AWAIT PATTERN
     */
    async obtenerTodosLosReportes() {
        try {
            const reportes = await this.reporteRepository.obtenerTodos();
            return reportes.map(reporte => this.convertirAResponseDTO(reporte));
        }
        catch (error) {
            throw new Error(`Error al obtener reportes: ${error.message}`);
        }
    }
    /**
     * Obtener reportes por estado usando ASYNC/AWAIT PATTERN
     */
    async obtenerReportesPorEstado(estado) {
        try {
            // Validar estado
            if (!Object.values(Estado_1.EstadoReporte).includes(estado)) {
                throw new Error(`Estado inválido: ${estado}`);
            }
            const reportes = await this.reporteRepository.obtenerPorEstado(estado);
            return reportes.map(reporte => this.convertirAResponseDTO(reporte));
        }
        catch (error) {
            throw new Error(`Error al obtener reportes por estado: ${error.message}`);
        }
    }
    /**
     * Obtener reportes por usuario usando ASYNC/AWAIT PATTERN
     */
    async obtenerReportesPorUsuario(idUsuario) {
        try {
            if (!idUsuario || idUsuario.trim().length === 0) {
                throw new Error('ID de usuario es requerido');
            }
            const reportes = await this.reporteRepository.obtenerPorUsuario(idUsuario);
            return reportes.map(reporte => this.convertirAResponseDTO(reporte));
        }
        catch (error) {
            throw new Error(`Error al obtener reportes por usuario: ${error.message}`);
        }
    }
    /**
     * Eliminar un reporte usando ASYNC/AWAIT PATTERN
     */
    async eliminarReporte(id) {
        try {
            const reporteId = new ReporteId_1.ReporteId(id);
            const eliminado = await this.reporteRepository.eliminar(reporteId);
            return eliminado;
        }
        catch (error) {
            throw new Error(`Error al eliminar reporte: ${error.message}`);
        }
    }
    /**
     * Obtener estadísticas de reportes
     */
    async obtenerEstadisticas() {
        try {
            const reportes = await this.reporteRepository.obtenerTodos();
            const estadisticas = {
                total: reportes.length,
                porEstado: {}
            };
            // Inicializar contadores
            Object.values(Estado_1.EstadoReporte).forEach(estado => {
                estadisticas.porEstado[estado] = 0;
            });
            // Contar reportes por estado
            reportes.forEach(reporte => {
                estadisticas.porEstado[reporte.estado.valor]++;
            });
            return estadisticas;
        }
        catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
    /**
     * Validaciones privadas para creación de reportes
     */
    validarDatosCreacion(datos) {
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
    validarDatosActualizacion(datos) {
        if (datos.titulo !== undefined && datos.titulo.trim().length < 5) {
            throw new Error('El título debe tener al menos 5 caracteres');
        }
        if (datos.descripcion !== undefined && datos.descripcion.trim().length < 10) {
            throw new Error('La descripción debe tener al menos 10 caracteres');
        }
        if (datos.estado !== undefined && !Object.values(Estado_1.EstadoReporte).includes(datos.estado)) {
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
    convertirAResponseDTO(reporte) {
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
exports.ReporteService = ReporteService;
