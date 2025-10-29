/**
 * Objeto de valor que representa un identificador único
 */
export declare class ReporteId {
    private readonly _valor;
    constructor(valor?: string);
    get valor(): string;
    private validarId;
    toString(): string;
    equals(otro: ReporteId): boolean;
    static generar(): ReporteId;
}
