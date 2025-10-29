"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = exports.EstadoReporte = void 0;
/**
 * Objeto de valor que representa el estado de un reporte
 */
var EstadoReporte;
(function (EstadoReporte) {
    EstadoReporte["PENDIENTE"] = "PENDIENTE";
    EstadoReporte["EN_REVISION"] = "EN_REVISION";
    EstadoReporte["EN_PROCESO"] = "EN_PROCESO";
    EstadoReporte["RESUELTO"] = "RESUELTO";
    EstadoReporte["CERRADO"] = "CERRADO";
    EstadoReporte["RECHAZADO"] = "RECHAZADO";
})(EstadoReporte || (exports.EstadoReporte = EstadoReporte = {}));
/**
 * Clase de valor que encapsula el estado del reporte con validaciones
 */
class Estado {
    constructor(valor) {
        this.validarEstado(valor);
        this._valor = valor;
    }
    get valor() {
        return this._valor;
    }
    validarEstado(estado) {
        if (!Object.values(EstadoReporte).includes(estado)) {
            throw new Error(`Estado inválido: ${estado}`);
        }
    }
    toString() {
        return this._valor;
    }
    equals(otro) {
        return this._valor === otro._valor;
    }
}
exports.Estado = Estado;
