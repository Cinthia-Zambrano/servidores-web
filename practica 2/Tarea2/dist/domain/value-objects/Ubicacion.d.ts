/**
 * Objeto de valor que representa una ubicación
 */
export declare class Ubicacion {
    private readonly _direccion;
    private readonly _ciudad;
    private readonly _coordenadas?;
    constructor(direccion: string, ciudad: string, coordenadas?: {
        latitud: number;
        longitud: number;
    });
    get direccion(): string;
    get ciudad(): string;
    get coordenadas(): {
        latitud: number;
        longitud: number;
    } | undefined;
    private validarUbicacion;
    toString(): string;
    equals(otra: Ubicacion): boolean;
}
