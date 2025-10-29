/**
 * Objeto de valor que representa el estado de un reporte
 */
export declare enum EstadoReporte {
    PENDIENTE = "PENDIENTE",
    EN_REVISION = "EN_REVISION",
    EN_PROCESO = "EN_PROCESO",
    RESUELTO = "RESUELTO",
    CERRADO = "CERRADO",
    RECHAZADO = "RECHAZADO"
}
/**
 * Clase de valor que encapsula el estado del reporte con validaciones
 */
export declare class Estado {
    private readonly _valor;
    constructor(valor: EstadoReporte);
    get valor(): EstadoReporte;
    private validarEstado;
    toString(): string;
    equals(otro: Estado): boolean;
}
