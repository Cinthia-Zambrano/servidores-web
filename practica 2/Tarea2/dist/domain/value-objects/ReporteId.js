"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteId = void 0;
const uuid_1 = require("uuid");
/**
 * Objeto de valor que representa un identificador único
 */
class ReporteId {
    constructor(valor) {
        this._valor = valor || (0, uuid_1.v4)();
        this.validarId(this._valor);
    }
    get valor() {
        return this._valor;
    }
    validarId(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new Error('ID de reporte inválido. Debe ser un UUID válido');
        }
    }
    toString() {
        return this._valor;
    }
    equals(otro) {
        return this._valor === otro._valor;
    }
    static generar() {
        return new ReporteId();
    }
}
exports.ReporteId = ReporteId;
