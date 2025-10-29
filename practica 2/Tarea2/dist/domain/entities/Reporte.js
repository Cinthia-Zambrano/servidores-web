"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporte = void 0;
const ReporteId_1 = require("../value-objects/ReporteId");
const Estado_1 = require("../value-objects/Estado");
/**
 * Entidad principal del dominio: Reporte de Infraestructura
 */
class Reporte {
    constructor(idUsuario, titulo, descripcion, ubicacion, estado = new Estado_1.Estado(Estado_1.EstadoReporte.PENDIENTE), id) {
        this.validarDatosIniciales(idUsuario, titulo, descripcion);
        this._id = id || ReporteId_1.ReporteId.generar();
        this._idUsuario = idUsuario;
        this._titulo = titulo.trim();
        this._descripcion = descripcion.trim();
        this._ubicacion = ubicacion;
        this._estado = estado;
        this._fechaCreacion = new Date();
        this._fechaActualizacion = new Date();
    }
    // Getters
    get id() {
        return this._id;
    }
    get idUsuario() {
        return this._idUsuario;
    }
    get titulo() {
        return this._titulo;
    }
    get descripcion() {
        return this._descripcion;
    }
    get ubicacion() {
        return this._ubicacion;
    }
    get estado() {
        return this._estado;
    }
    get fechaCreacion() {
        return this._fechaCreacion;
    }
    get fechaActualizacion() {
        return this._fechaActualizacion;
    }
    // Métodos de negocio
    actualizarTitulo(nuevoTitulo) {
        this.validarTitulo(nuevoTitulo);
        this._titulo = nuevoTitulo.trim();
        this.actualizarFecha();
    }
    actualizarDescripcion(nuevaDescripcion) {
        this.validarDescripcion(nuevaDescripcion);
        this._descripcion = nuevaDescripcion.trim();
        this.actualizarFecha();
    }
    actualizarUbicacion(nuevaUbicacion) {
        this._ubicacion = nuevaUbicacion;
        this.actualizarFecha();
    }
    cambiarEstado(nuevoEstado) {
        this.validarCambioEstado(nuevoEstado);
        this._estado = nuevoEstado;
        this.actualizarFecha();
    }
    puedeSerEliminado() {
        return this._estado.valor === Estado_1.EstadoReporte.PENDIENTE ||
            this._estado.valor === Estado_1.EstadoReporte.RECHAZADO ||
            this._estado.valor === Estado_1.EstadoReporte.CERRADO;
    }
    // Validaciones privadas
    validarDatosIniciales(idUsuario, titulo, descripcion) {
        if (!idUsuario || idUsuario.trim().length === 0) {
            throw new Error('ID de usuario es requerido');
        }
        this.validarTitulo(titulo);
        this.validarDescripcion(descripcion);
    }
    validarTitulo(titulo) {
        if (!titulo || titulo.trim().length < 5) {
            throw new Error('El título debe tener al menos 5 caracteres');
        }
        if (titulo.trim().length > 100) {
            throw new Error('El título no puede exceder 100 caracteres');
        }
    }
    validarDescripcion(descripcion) {
        if (!descripcion || descripcion.trim().length < 10) {
            throw new Error('La descripción debe tener al menos 10 caracteres');
        }
        if (descripcion.trim().length > 1000) {
            throw new Error('La descripción no puede exceder 1000 caracteres');
        }
    }
    validarCambioEstado(nuevoEstado) {
        const transicionesValidas = {
            [Estado_1.EstadoReporte.PENDIENTE]: [Estado_1.EstadoReporte.EN_REVISION, Estado_1.EstadoReporte.RECHAZADO],
            [Estado_1.EstadoReporte.EN_REVISION]: [Estado_1.EstadoReporte.EN_PROCESO, Estado_1.EstadoReporte.RECHAZADO, Estado_1.EstadoReporte.PENDIENTE],
            [Estado_1.EstadoReporte.EN_PROCESO]: [Estado_1.EstadoReporte.RESUELTO, Estado_1.EstadoReporte.EN_REVISION],
            [Estado_1.EstadoReporte.RESUELTO]: [Estado_1.EstadoReporte.CERRADO, Estado_1.EstadoReporte.EN_PROCESO],
            [Estado_1.EstadoReporte.CERRADO]: [],
            [Estado_1.EstadoReporte.RECHAZADO]: [Estado_1.EstadoReporte.PENDIENTE]
        };
        const estadosPermitidos = transicionesValidas[this._estado.valor];
        if (!estadosPermitidos.includes(nuevoEstado.valor)) {
            throw new Error(`No se puede cambiar el estado de ${this._estado.valor} a ${nuevoEstado.valor}`);
        }
    }
    actualizarFecha() {
        this._fechaActualizacion = new Date();
    }
    // Método de utilidad para serialización
    toJSON() {
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
exports.Reporte = Reporte;
