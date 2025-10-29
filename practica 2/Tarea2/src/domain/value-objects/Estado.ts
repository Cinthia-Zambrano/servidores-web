/**
 * Objeto de valor que representa el estado de un reporte
 */
export enum EstadoReporte {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  CERRADO = 'CERRADO',
  RECHAZADO = 'RECHAZADO'
}

/**
 * Clase de valor que encapsula el estado del reporte con validaciones
 */
export class Estado {
  private readonly _valor: EstadoReporte;

  constructor(valor: EstadoReporte) {
    this.validarEstado(valor);
    this._valor = valor;
  }

  get valor(): EstadoReporte {
    return this._valor;
  }

  private validarEstado(estado: EstadoReporte): void {
    if (!Object.values(EstadoReporte).includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }
  }

  toString(): string {
    return this._valor;
  }

  equals(otro: Estado): boolean {
    return this._valor === otro._valor;
  }
}