"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteMemoryRepository = void 0;
const Reporte_1 = require("../../domain/entities/Reporte");
const Estado_1 = require("../../domain/value-objects/Estado");
const Ubicacion_1 = require("../../domain/value-objects/Ubicacion");
/**
 * Implementación en memoria del repositorio de reportes
 * Aplica diferentes paradigmas asíncronos según la operación CRUD
 */
class ReporteMemoryRepository {
    constructor() {
        this.reportes = new Map();
        this.latenciaRed = 100; // Simula latencia de red
        this.inicializarDatosPrueba();
    }
    /**
     * CALLBACK PATTERN - CREATE OPERATION
     * Simula latencia de red y usa patrón callback tradicional
     */
    crear(reporte, callback) {
        // Simular latencia de red
        setTimeout(() => {
            try {
                // Validar si el reporte ya existe
                if (this.reportes.has(reporte.id.valor)) {
                    const error = new Error(`Ya existe un reporte con ID: ${reporte.id.valor}`);
                    return callback(error);
                }
                // Validaciones de negocio
                if (!reporte.titulo || reporte.titulo.length < 5) {
                    const error = new Error('El título del reporte debe tener al menos 5 caracteres');
                    return callback(error);
                }
                if (!reporte.descripcion || reporte.descripcion.length < 10) {
                    const error = new Error('La descripción del reporte debe tener al menos 10 caracteres');
                    return callback(error);
                }
                // Insertar el reporte
                this.reportes.set(reporte.id.valor, reporte);
                // Callback exitoso con el resultado
                callback(null, reporte);
            }
            catch (error) {
                // Manejo de errores inesperados
                callback(error);
            }
        }, this.latenciaRed);
    }
    /**
     * PROMISE PATTERN - UPDATE OPERATION
     * Usa Promises con .then() y .catch() para actualización
     */
    actualizar(id, datosActualizacion) {
        return new Promise((resolve, reject) => {
            // Simular latencia de red
            setTimeout(() => {
                try {
                    // Validar existencia del registro
                    const reporteExistente = this.reportes.get(id.valor);
                    if (!reporteExistente) {
                        reject(new Error(`No se encontró el reporte con ID: ${id.valor}`));
                        return;
                    }
                    // Crear copia del reporte para actualización
                    let reporteActualizado = reporteExistente;
                    // Actualización parcial de campos
                    if (datosActualizacion.titulo !== undefined) {
                        if (datosActualizacion.titulo.length < 5) {
                            reject(new Error('El título debe tener al menos 5 caracteres'));
                            return;
                        }
                        reporteActualizado.actualizarTitulo(datosActualizacion.titulo);
                    }
                    if (datosActualizacion.descripcion !== undefined) {
                        if (datosActualizacion.descripcion.length < 10) {
                            reject(new Error('La descripción debe tener al menos 10 caracteres'));
                            return;
                        }
                        reporteActualizado.actualizarDescripcion(datosActualizacion.descripcion);
                    }
                    if (datosActualizacion.ubicacion) {
                        const nuevaUbicacion = new Ubicacion_1.Ubicacion(datosActualizacion.ubicacion.direccion, datosActualizacion.ubicacion.ciudad, datosActualizacion.ubicacion.coordenadas);
                        reporteActualizado.actualizarUbicacion(nuevaUbicacion);
                    }
                    if (datosActualizacion.estado !== undefined) {
                        const nuevoEstado = new Estado_1.Estado(datosActualizacion.estado);
                        reporteActualizado.cambiarEstado(nuevoEstado);
                    }
                    // Guardar cambios
                    this.reportes.set(id.valor, reporteActualizado);
                    // Resolver con el reporte actualizado
                    resolve(reporteActualizado);
                }
                catch (error) {
                    reject(error);
                }
            }, this.latenciaRed);
        });
    }
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Individual)
     * Obtiene un reporte específico por ID
     */
    async obtenerPorId(id) {
        try {
            // Simular operación asíncrona
            await this.simularLatencia();
            const reporte = this.reportes.get(id.valor);
            return reporte || null;
        }
        catch (error) {
            throw new Error(`Error al obtener reporte: ${error}`);
        }
    }
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Listado completo)
     * Obtiene todos los reportes
     */
    async obtenerTodos() {
        try {
            // Simular operación asíncrona
            await this.simularLatencia();
            return Array.from(this.reportes.values())
                .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        }
        catch (error) {
            throw new Error(`Error al obtener todos los reportes: ${error}`);
        }
    }
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Filtrado por estado)
     */
    async obtenerPorEstado(estado) {
        try {
            await this.simularLatencia();
            return Array.from(this.reportes.values())
                .filter(reporte => reporte.estado.valor === estado)
                .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        }
        catch (error) {
            throw new Error(`Error al obtener reportes por estado: ${error}`);
        }
    }
    /**
     * ASYNC/AWAIT PATTERN - READ OPERATION (Filtrado por usuario)
     */
    async obtenerPorUsuario(idUsuario) {
        try {
            await this.simularLatencia();
            if (!idUsuario || idUsuario.trim().length === 0) {
                throw new Error('ID de usuario es requerido');
            }
            return Array.from(this.reportes.values())
                .filter(reporte => reporte.idUsuario === idUsuario)
                .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        }
        catch (error) {
            throw new Error(`Error al obtener reportes por usuario: ${error}`);
        }
    }
    /**
     * ASYNC/AWAIT PATTERN - DELETE OPERATION
     * Elimina un reporte con validaciones de negocio
     */
    async eliminar(id) {
        try {
            await this.simularLatencia();
            // Validación de existencia antes de eliminar
            const reporte = this.reportes.get(id.valor);
            if (!reporte) {
                throw new Error(`No se encontró el reporte con ID: ${id.valor}`);
            }
            // Validar si el reporte puede ser eliminado según reglas de negocio
            if (!reporte.puedeSerEliminado()) {
                throw new Error(`No se puede eliminar el reporte en estado: ${reporte.estado.valor}. ` +
                    'Solo se pueden eliminar reportes en estado PENDIENTE, RECHAZADO o CERRADO.');
            }
            // Eliminación física del registro
            const eliminado = this.reportes.delete(id.valor);
            // Retorna boolean indicando éxito/fallo
            return eliminado;
        }
        catch (error) {
            // Manejo elegante de errores
            throw error;
        }
    }
    /**
     * Método auxiliar para contar reportes
     */
    async contarReportes() {
        try {
            await this.simularLatencia();
            return this.reportes.size;
        }
        catch (error) {
            throw new Error(`Error al contar reportes: ${error}`);
        }
    }
    /**
     * Método privado para simular latencia de red
     */
    simularLatencia() {
        return new Promise(resolve => {
            setTimeout(resolve, this.latenciaRed);
        });
    }
    /**
     * Inicializa datos de prueba realistas (mínimo 10 registros)
     */
    inicializarDatosPrueba() {
        const datosIniciales = [
            {
                idUsuario: 'user001',
                titulo: 'Falla en sistema eléctrico del edificio A',
                descripcion: 'Se reporta intermitencia en el suministro eléctrico del primer piso del edificio A. Las luces se apagan y encienden cada 15 minutos aproximadamente.',
                ubicacion: new Ubicacion_1.Ubicacion('Av. Principal 123, Edificio A, Piso 1', 'Quito', { latitud: -0.1807, longitud: -78.4678 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.PENDIENTE)
            },
            {
                idUsuario: 'user002',
                titulo: 'Tubería rota en baños del segundo piso',
                descripcion: 'Fuga de agua considerable en los baños del segundo piso. El agua está afectando las oficinas adyacentes y se requiere atención inmediata.',
                ubicacion: new Ubicacion_1.Ubicacion('Calle Secundaria 456, Edificio B, Piso 2', 'Guayaquil', { latitud: -2.1894, longitud: -79.8890 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.EN_REVISION)
            },
            {
                idUsuario: 'user003',
                titulo: 'Aire acondicionado central fuera de servicio',
                descripcion: 'El sistema de aire acondicionado central no está funcionando desde hace 3 días. La temperatura en las oficinas es insoportable.',
                ubicacion: new Ubicacion_1.Ubicacion('Plaza Central 789, Torre Norte, Piso 5', 'Cuenca', { latitud: -2.9001, longitud: -79.0059 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.EN_PROCESO)
            },
            {
                idUsuario: 'user001',
                titulo: 'Ascensor principal con ruidos extraños',
                descripcion: 'El ascensor principal hace ruidos metálicos al subir y bajar. Los empleados están preocupados por su seguridad.',
                ubicacion: new Ubicacion_1.Ubicacion('Av. Principal 123, Edificio A, Hall Principal', 'Quito', { latitud: -0.1807, longitud: -78.4678 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.RESUELTO)
            },
            {
                idUsuario: 'user004',
                titulo: 'Goteras en el techo de la cafetería',
                descripcion: 'Se observan múltiples goteras en el techo de la cafetería, especialmente cuando llueve. El agua está dañando el mobiliario.',
                ubicacion: new Ubicacion_1.Ubicacion('Edificio Principal, Cafetería, Planta Baja', 'Ambato', { latitud: -1.2544, longitud: -78.6267 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.CERRADO)
            },
            {
                idUsuario: 'user002',
                titulo: 'Red WiFi intermitente en área de trabajo',
                descripcion: 'La señal WiFi se corta constantemente en el área de desarrollo. Esto está afectando la productividad del equipo técnico.',
                ubicacion: new Ubicacion_1.Ubicacion('Calle Secundaria 456, Edificio B, Piso 3', 'Guayaquil', { latitud: -2.1894, longitud: -79.8890 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.RECHAZADO)
            },
            {
                idUsuario: 'user005',
                titulo: 'Ventanas rotas en sala de reuniones',
                descripcion: 'Tres ventanas de la sala de reuniones principal están agrietadas debido al fuerte viento de la semana pasada.',
                ubicacion: new Ubicacion_1.Ubicacion('Torre Empresarial, Piso 10, Sala Ejecutiva', 'Machala', { latitud: -3.2581, longitud: -79.9553 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.PENDIENTE)
            },
            {
                idUsuario: 'user003',
                titulo: 'Puerta de emergencia bloqueada',
                descripcion: 'La puerta de emergencia del piso 4 está bloqueada por escombros. Esto representa un riesgo de seguridad importante.',
                ubicacion: new Ubicacion_1.Ubicacion('Plaza Central 789, Torre Norte, Piso 4', 'Cuenca', { latitud: -2.9001, longitud: -79.0059 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.EN_REVISION)
            },
            {
                idUsuario: 'user006',
                titulo: 'Sistema de seguridad cámaras desconectadas',
                descripcion: 'Varias cámaras de seguridad del perímetro están desconectadas desde el fin de semana. Se requiere revisión técnica.',
                ubicacion: new Ubicacion_1.Ubicacion('Perímetro Norte, Estación de Vigilancia', 'Riobamba', { latitud: -1.6711, longitud: -78.6475 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.EN_PROCESO)
            },
            {
                idUsuario: 'user004',
                titulo: 'Calefacción central no funciona correctamente',
                descripcion: 'El sistema de calefacción no está distribuyendo calor uniformemente. Algunas áreas están muy frías mientras otras muy calientes.',
                ubicacion: new Ubicacion_1.Ubicacion('Edificio Principal, Sistema Central, Sótano', 'Ambato', { latitud: -1.2544, longitud: -78.6267 }),
                estado: new Estado_1.Estado(Estado_1.EstadoReporte.PENDIENTE)
            }
        ];
        // Crear reportes con datos iniciales
        datosIniciales.forEach(data => {
            const reporte = new Reporte_1.Reporte(data.idUsuario, data.titulo, data.descripcion, data.ubicacion, data.estado);
            this.reportes.set(reporte.id.valor, reporte);
        });
    }
}
exports.ReporteMemoryRepository = ReporteMemoryRepository;
