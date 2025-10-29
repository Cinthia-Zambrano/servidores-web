import { v4 as uuidv4 } from 'uuid';

/**
 * Objeto de valor que representa un identificador único
 */
export class ReporteId {
  private readonly _valor: string;

  constructor(valor?: string) {
    this._valor = valor || uuidv4();
    this.validarId(this._valor);
  }

  get valor(): string {
    return this._valor;
  }

  private validarId(id: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('ID de reporte inválido. Debe ser un UUID válido');
    }
  }

  toString(): string {
    return this._valor;
  }

  equals(otro: ReporteId): boolean {
    return this._valor === otro._valor;
  }

  static generar(): ReporteId {
    return new ReporteId();
  }
}