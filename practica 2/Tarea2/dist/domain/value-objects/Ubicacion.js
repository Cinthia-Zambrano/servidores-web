"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ubicacion = void 0;
/**
 * Objeto de valor que representa una ubicación
 */
class Ubicacion {
    constructor(direccion, ciudad, coordenadas) {
        this.validarUbicacion(direccion, ciudad, coordenadas);
        this._direccion = direccion.trim();
        this._ciudad = ciudad.trim();
        this._coordenadas = coordenadas;
    }
    get direccion() {
        return this._direccion;
    }
    get ciudad() {
        return this._ciudad;
    }
    get coordenadas() {
        return this._coordenadas;
    }
    validarUbicacion(direccion, ciudad, coordenadas) {
        if (!direccion || direccion.trim().length < 5) {
            throw new Error('La dirección debe tener al menos 5 caracteres');
        }
        if (!ciudad || ciudad.trim().length < 2) {
            throw new Error('La ciudad debe tener al menos 2 caracteres');
        }
        if (coordenadas) {
            if (coordenadas.latitud < -90 || coordenadas.latitud > 90) {
                throw new Error('La latitud debe estar entre -90 y 90 grados');
            }
            if (coordenadas.longitud < -180 || coordenadas.longitud > 180) {
                throw new Error('La longitud debe estar entre -180 y 180 grados');
            }
        }
    }
    toString() {
        const coords = this._coordenadas
            ? ` (${this._coordenadas.latitud}, ${this._coordenadas.longitud})`
            : '';
        return `${this._direccion}, ${this._ciudad}${coords}`;
    }
    equals(otra) {
        return (this._direccion === otra._direccion &&
            this._ciudad === otra._ciudad &&
            JSON.stringify(this._coordenadas) === JSON.stringify(otra._coordenadas));
    }
}
exports.Ubicacion = Ubicacion;
