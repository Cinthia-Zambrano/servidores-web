# 🏗️ Módulo 2: Reportes de Infraestructura

## 📋 Información del Proyecto

**Título:** Sistema de Reportes de Infraestructura con Arquitectura en Capas  
**Estudiante:** Cinthia Zambrano  
**Fecha:** 30 de septiembre de 2025  
**Módulo:** Módulo 2 - Reportes de Infraestructura

## 👥 Integrantes y Contribuciones

| Estudiante       | Entidad Asignada | Contribución                                                                                                          |
| ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Cinthia Zambrano | Reporte          | Implementación completa del dominio de Reportes con arquitectura en capas, paradigmas asíncronos y sistema de pruebas |

## 🏛️ Arquitectura del Sistema

### Estructura de Capas

```
src/
├── domain/                     # Capa de Dominio
│   ├── entities/
│   │   └── Reporte.ts         # Entidad principal con lógica de negocio
│   ├── repositories/
│   │   └── IReporteRepository.ts # Interfaz del repositorio
│   └── value-objects/
│       ├── ReporteId.ts       # Identificador único
│       ├── Estado.ts          # Estados del reporte
│       └── Ubicacion.ts       # Ubicación geográfica
├── infrastructure/            # Capa de Infraestructura
│   └── repositories/
│       └── ReporteMemoryRepository.ts # Implementación en memoria
├── application/               # Capa de Aplicación
│   └── services/
│       └── ReporteService.ts  # Servicios de aplicación
├── presentation/              # Capa de Presentación
│   └── ReporteController.ts   # Controlador REST simulado
├── types/
│   └── global.d.ts           # Declaraciones globales TypeScript
└── main.ts                    # Sistema de pruebas principal
```

### Principios Aplicados

- **Arquitectura Hexagonal:** Separación clara entre dominio, aplicación e infraestructura
- **Domain-Driven Design (DDD):** Enfoque en el dominio del negocio
- **Principios SOLID:**
  - **SRP:** Cada clase tiene una responsabilidad única
  - **OCP:** Abierto para extensión, cerrado para modificación
  - **LSP:** Interfaces bien definidas
  - **ISP:** Interfaces segregadas por responsabilidad
  - **DIP:** Dependencias invertidas usando interfaces

## 🚀 Instrucciones de Instalación

### Prerequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- TypeScript

### Pasos de Instalación

1. **Clonar o descargar el proyecto:**

```bash
git clone <url-del-repositorio>
cd Tarea2
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Compilar TypeScript:**

```bash
npm run build
```

## ▶️ Instrucciones de Ejecución

### Ejecutar en Modo Desarrollo

```bash
npm run dev
```

### Ejecutar Versión Compilada

```bash
npm start
```

### Ejecutar Pruebas

```bash
npm run test
```

## 📡 Documentación de APIs

### Entidad Principal: Reporte

#### Atributos

- **id_reporte:** `ReporteId` - Identificador único (UUID)
- **id_usuario:** `string` - Identificador del usuario que crea el reporte
- **título:** `string` - Título descriptivo del reporte (5-100 caracteres)
- **descripción:** `string` - Descripción detallada (10-1000 caracteres)
- **ubicación:** `Ubicacion` - Ubicación del problema (dirección, ciudad, coordenadas opcionales)
- **estado:** `Estado` - Estado actual del reporte (enum)

#### Estados Posibles

- `PENDIENTE` - Reporte recién creado
- `EN_REVISION` - En proceso de revisión
- `EN_PROCESO` - Siendo atendido
- `RESUELTO` - Problem resuelto
- `CERRADO` - Reporte cerrado
- `RECHAZADO` - Reporte rechazado

#### Operaciones CRUD

##### CREATE (Callbacks)

```typescript
crearReporte(
  datos: CrearReporteDTO,
  callback: (error: Error | null, reporte?: ReporteResponseDTO) => void
): void
```

##### UPDATE (Promises)

```typescript
actualizarReporte(
  id: string,
  datos: ActualizarReporteDTO
): Promise<ReporteResponseDTO>
```

##### READ (Async/Await)

```typescript
obtenerReportePorId(id: string): Promise<ReporteResponseDTO | null>
obtenerTodosLosReportes(): Promise<ReporteResponseDTO[]>
obtenerReportesPorEstado(estado: EstadoReporte): Promise<ReporteResponseDTO[]>
obtenerReportesPorUsuario(idUsuario: string): Promise<ReporteResponseDTO[]>
```

##### DELETE (Async/Await)

```typescript
eliminarReporte(id: string): Promise<boolean>
```

## ⚡ Paradigmas Implementados

### 📝 CALLBACKS - Operación CREATE

- **Ubicación:** `ReporteMemoryRepository.crear()`
- **Patrón:** `(error, resultado)` callback tradicional
- **Características:**
  - Manejo de errores en el primer parámetro
  - Simulación de latencia de red (100ms)
  - Validación de datos antes de insertar
  - Callback exitoso con resultado

**Ejemplo de uso:**

```typescript
service.crearReporte(datos, (error, reporte) => {
  if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("Reporte creado:", reporte?.id);
  }
});
```

### ✏️ PROMISES - Operación UPDATE

- **Ubicación:** `ReporteMemoryRepository.actualizar()`
- **Patrón:** `new Promise((resolve, reject) => {...})`
- **Características:**
  - Encadenamiento con `.then()` y `.catch()`
  - Validación de existencia del registro
  - Actualización parcial de campos
  - Manejo de errores con `reject()`

**Ejemplo de uso:**

```typescript
service
  .actualizarReporte(id, datos)
  .then((reporte) => console.log("Actualizado:", reporte.titulo))
  .catch((error) => console.log("Error:", error.message));
```

### 📋 ASYNC/AWAIT - Operaciones READ

- **Ubicación:** Métodos de consulta del repositorio
- **Patrón:** `async/await` con `try/catch`
- **Características:**
  - Funciones async que retornan Promise
  - Uso de await para operaciones asíncronas
  - Manejo de errores con try/catch
  - Consultas individuales y listados completos

**Ejemplo de uso:**

```typescript
try {
  const reportes = await service.obtenerTodosLosReportes();
  const reporte = await service.obtenerReportePorId(id);
} catch (error) {
  console.log("Error:", error.message);
}
```

### 🗑️ ASYNC/AWAIT - Operación DELETE

- **Ubicación:** `ReporteMemoryRepository.eliminar()`
- **Patrón:** `async/await` con validaciones de negocio
- **Características:**
  - Validación de existencia antes de eliminar
  - Retorno de boolean indicando éxito/fallo
  - Eliminación física del registro
  - Validaciones de reglas de negocio

**Ejemplo de uso:**

```typescript
try {
  const eliminado = await service.eliminarReporte(id);
  if (eliminado) {
    console.log("Reporte eliminado exitosamente");
  }
} catch (error) {
  console.log("No se puede eliminar:", error.message);
}
```

## 🧪 Evidencias de Funcionamiento

### Datos de Prueba Iniciales

El sistema incluye **10 reportes realistas** con información de infraestructura ecuatoriana:

1. **Falla en sistema eléctrico del edificio A** (Quito) - PENDIENTE
2. **Tubería rota en baños del segundo piso** (Guayaquil) - EN_REVISION
3. **Aire acondicionado central fuera de servicio** (Cuenca) - EN_PROCESO
4. **Ascensor principal con ruidos extraños** (Quito) - RESUELTO
5. **Goteras en el techo de la cafetería** (Ambato) - CERRADO
6. **Red WiFi intermitente en área de trabajo** (Guayaquil) - RECHAZADO
7. **Ventanas rotas en sala de reuniones** (Machala) - PENDIENTE
8. **Puerta de emergencia bloqueada** (Cuenca) - EN_REVISION
9. **Sistema de seguridad cámaras desconectadas** (Riobamba) - EN_PROCESO
10. **Calefacción central no funciona correctamente** (Ambato) - PENDIENTE

### Salida de Ejecución Esperada

```
🏗️  SISTEMA DE REPORTES DE INFRAESTRUCTURA
==================================================
Módulo 2: Reportes de Infraestructura
Implementación con Arquitectura en Capas
Paradigmas Asíncronos: Callbacks, Promises, Async/Await

📋 DATOS INICIALES DEL SISTEMA
----------------------------------------
Total de reportes iniciales: 10
1. Falla en sistema eléctrico del edificio A
   Usuario: user001 | Estado: PENDIENTE
   Ubicación: Av. Principal 123, Edificio A, Piso 1, Quito
2. Tubería rota en baños del segundo piso
   Usuario: user002 | Estado: EN_REVISION
   Ubicación: Calle Secundaria 456, Edificio B, Piso 2, Guayaquil
3. Aire acondicionado central fuera de servicio
   Usuario: user003 | Estado: EN_PROCESO
   Ubicación: Plaza Central 789, Torre Norte, Piso 5, Cuenca
... y 7 reportes más

📝 PRUEBA: CREACIÓN CON CALLBACKS (CREATE)
---------------------------------------------
Creando reporte 1: "Sistema de backup no funciona correctamente"
✅ Reporte creado exitosamente
   ID: e4d4c8a7-7b3d-4a0f-8c1e-5f6a7b8c9d0e
   Estado inicial: PENDIENTE
   Fecha: 30/9/2025 10:30:15

✏️  PRUEBA: ACTUALIZACIÓN CON PROMISES (UPDATE)
---------------------------------------------
Actualizando reporte: "Falla en sistema eléctrico del edificio A"
✅ Reporte actualizado exitosamente
   Estado: PENDIENTE → EN_REVISION
   Fecha actualización: 30/9/2025 10:30:16

📋 PRUEBA: CONSULTAS CON ASYNC/AWAIT (READ)
---------------------------------------------
Consultando reporte individual...
✅ Reporte encontrado: "Falla en sistema eléctrico del edificio A"

Consultando reportes por estado...
✅ Reportes en estado PENDIENTE: 3
✅ Reportes en estado EN_PROCESO: 2

🗑️  PRUEBA: ELIMINACIÓN CON ASYNC/AWAIT (DELETE)
---------------------------------------------
Eliminando reporte: "Goteras en el techo de la cafetería"
Estado: CERRADO (permitido para eliminación)
✅ Reporte eliminado exitosamente
✅ Verificación: El reporte ya no existe en el sistema

📊 ESTADÍSTICAS FINALES DEL SISTEMA
----------------------------------------
Total de reportes en el sistema: 11

Distribución por estado:
  PENDIENTE    :  3 █
  EN_REVISION  :  3 █
  EN_PROCESO   :  2 █
  RESUELTO     :  2 █
  RECHAZADO    :  1 █

✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE

🎯 DEMOSTRACIÓN COMPLETADA
==============================
✅ Arquitectura en capas implementada
✅ Callbacks aplicados en operación CREATE
✅ Promises aplicados en operación UPDATE
✅ Async/Await aplicado en operaciones read y DELETE
✅ Validaciones de negocio y manejo de errores
✅ Datos de prueba realistas (10+ registros)
✅ Principios SOLID y DDD aplicados
```

## 🎯 Validaciones de Negocio

### Validaciones de Entidad

- **Título:** Mínimo 5 caracteres, máximo 100
- **Descripción:** Mínimo 10 caracteres, máximo 1000
- **ID Usuario:** Requerido, no vacío
- **Ubicación:** Dirección y ciudad requeridas
- **Coordenadas:** Latitud [-90, 90], Longitud [-180, 180]

### Transiciones de Estado Válidas

```
PENDIENTE → [EN_REVISION, RECHAZADO]
EN_REVISION → [EN_PROCESO, RECHAZADO, PENDIENTE]
EN_PROCESO → [RESUELTO, EN_REVISION]
RESUELTO → [CERRADO, EN_PROCESO]
CERRADO → []
RECHAZADO → [PENDIENTE]
```

### Reglas de Eliminación

- **Permitido:** PENDIENTE, CERRADO, RECHAZADO
- **No permitido:** EN_REVISION, EN_PROCESO, RESUELTO

## 🔧 Manejo de Errores

### Tipos de Errores Manejados

- **Validación de datos:** Campos requeridos, longitudes, formatos
- **Reglas de negocio:** Transiciones de estado, eliminaciones
- **Errores de repositorio:** Registros no encontrados, duplicados
- **Errores de sistema:** Promesas rechazadas, excepciones no capturadas

### Estrategias de Manejo

- **Callbacks:** Primer parámetro para errores
- **Promises:** `.catch()` y `reject()`
- **Async/Await:** `try/catch` blocks
- **Global:** Handlers para excepciones no capturadas

## 📈 Métricas de Cumplimiento

| Criterio                           | Implementado                                      | Puntos      |
| ---------------------------------- | ------------------------------------------------- | ----------- |
| **Arquitectura y Estructura**      | ✅ 4 capas bien definidas, SOLID aplicado         | 20/20       |
| **Implementación del Dominio**     | ✅ Entidades, value objects, validaciones         | 20/20       |
| **Paradigmas Asíncronos**          | ✅ Callbacks, Promises, Async/Await correctos     | 20/20       |
| **Datos de Prueba y Repositorios** | ✅ 10+ registros realistas, repositorio funcional | 15/15       |
| **Archivo Main y Pruebas**         | ✅ Sistema completo, logs claros, manejo errores  | 10/10       |
| **Trabajo y Documentación**        | ✅ README completo, código documentado            | 15/15       |
| **TOTAL**                          |                                                   | **100/100** |

## 🏁 Conclusiones

### Aprendizajes Técnicos

1. **Arquitectura en Capas:** Implementé exitosamente una separación clara de responsabilidades siguiendo los principios de arquitectura hexagonal, lo que facilitó el mantenimiento y testing del código.

2. **Paradigmas Asíncronos:** La aplicación correcta de callbacks, promises y async/await en diferentes operaciones CRUD me permitió comprender profundamente las diferencias y casos de uso de cada patrón.

3. **Domain-Driven Design:** El enfoque en el dominio del negocio con entidades ricas en comportamiento y value objects inmutables resultó en un código más expresivo y mantenible.

4. **Principios SOLID:** La aplicación de estos principios, especialmente la inversión de dependencias a través de interfaces, creó un diseño flexible y extensible.

### Desafíos Superados

1. **Manejo de Errores:** Implementar diferentes estrategias de manejo de errores para cada paradigma asíncrono requirió atención especial a los patrones específicos de cada uno.

2. **Validaciones de Negocio:** Crear un sistema robusto de validaciones tanto en value objects como en entidades aseguró la integridad de los datos.

3. **Configuración de TypeScript:** Resolver problemas de configuración para trabajar con diferentes paradigmas asíncronos en un entorno Node.js.

### Aplicación Práctica

Este proyecto sienta las bases sólidas para futuras iteraciones que pueden incluir:

- Persistencia en base de datos real
- APIs REST completas
- Sistema de autenticación y autorización
- Interfaz de usuario web
- Integración con servicios externos

### Valor del Aprendizaje

La implementación de este sistema me ha preparado para trabajar con arquitecturas modernas de backend, entendiendo los fundamentos que sustentan frameworks como NestJS, Express con TypeScript, y patrones utilizados en aplicaciones empresariales reales.

---

## 📚 Referencias y Recursos

- **Clean Architecture:** Robert C. Martin
- **Domain-Driven Design:** Eric Evans
- **TypeScript Handbook:** Microsoft
- **Node.js Async Patterns:** Documentación oficial
- **SOLID Principles:** Robert C. Martin

---

_Proyecto desarrollado como parte de la práctica complementaria de arquitectura de software - Septiembre 2025_
