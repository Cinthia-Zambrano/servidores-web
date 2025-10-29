
// ===============================
// Archivo principal de la aplicación
// Aquí se ejecutan pruebas de todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
// usando diferentes paradigmas asíncronos (Callbacks, Promises, Async/Await)
//
// Estructura basada en arquitectura en capas:
// - Dominio: Entidades y lógica de negocio
// - Aplicación: Servicios y DTOs
// - Infraestructura: Repositorios (persistencia)
// - Presentación: Controladores (simulación de endpoints)
// ===============================

import { ReporteMemoryRepository } from './infrastructure/repositories/ReporteMemoryRepository';
import { ReporteService, CrearReporteDTO, ActualizarReporteDTO } from './application/services/ReporteService';
import { EstadoReporte } from './domain/value-objects/Estado';


// Clase principal que orquesta la ejecución de pruebas del sistema de reportes
class SistemaPruebasReportes {
  // Servicio de aplicación para manejar la lógica de reportes
  private reporteService: ReporteService;
  // Repositorio en memoria (simula la base de datos)
  private repositorio: ReporteMemoryRepository;

  constructor() {
    // Inicializa el repositorio y el servicio
    this.repositorio = new ReporteMemoryRepository();
    this.reporteService = new ReporteService(this.repositorio);
  }


  /**
   * Ejecuta todas las pruebas del sistema de reportes
   * Aquí se demuestra el uso de los diferentes patrones asíncronos
   */
  async ejecutarTodasLasPruebas(): Promise<void> {
    console.log('\n🏗️  SISTEMA DE REPORTES DE INFRAESTRUCTURA');
    console.log('='.repeat(50));
    console.log('Módulo 2: Reportes de Infraestructura');
    console.log('Implementación con Arquitectura en Capas');
    console.log('Paradigmas Asíncronos: Callbacks, Promises, Async/Await\n');

    try {
      // 1. Mostrar datos iniciales cargados en el sistema
      await this.mostrarDatosIniciales();
      // 2. Crear reportes usando callbacks
      await this.probarCreacionConCallbacks();
      // 3. Actualizar reportes usando Promises
      await this.probarActualizacionConPromises();
      // 4. Consultar reportes usando Async/Await
      await this.probarConsultasConAsyncAwait();
      // 5. Eliminar reportes usando Async/Await
      await this.probarEliminacionConAsyncAwait();
      // 6. Mostrar estadísticas finales
      await this.mostrarEstadisticasFinales();

      console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    } catch (error) {
      console.error('\n❌ ERROR EN LAS PRUEBAS:', error);
    }
  }


  /**
   * Muestra los datos iniciales cargados en el sistema
   * Útil para ver el estado antes de realizar operaciones
   */
  private async mostrarDatosIniciales(): Promise<void> {
    console.log('\n📋 DATOS INICIALES DEL SISTEMA');
    console.log('-'.repeat(40));
    // Obtiene todos los reportes existentes
    const reportes = await this.reporteService.obtenerTodosLosReportes();
    console.log(`Total de reportes iniciales: ${reportes.length}`);
    // Muestra los primeros 3 reportes como ejemplo
    reportes.slice(0, 3).forEach((reporte, index) => {
      console.log(`${index + 1}. ${reporte.titulo}`);
      console.log(`   Usuario: ${reporte.idUsuario} | Estado: ${reporte.estado}`);
      console.log(`   Ubicación: ${reporte.ubicacion.direccion}, ${reporte.ubicacion.ciudad}`);
    });
    console.log(`... y ${reportes.length - 3} reportes más`);
  }


  /**
   * Demuestra la creación de reportes usando el patrón CALLBACK
   * Se crean dos reportes nuevos y se maneja el resultado con callbacks
   */
  private async probarCreacionConCallbacks(): Promise<void> {
    console.log('\n📝 PRUEBA: CREACIÓN CON CALLBACKS (CREATE)');
    console.log('-'.repeat(45));

    // Ejemplo de nuevos reportes a crear
    const nuevosReportes: CrearReporteDTO[] = [
      {
        idUsuario: 'user007',
        titulo: 'Sistema de backup no funciona correctamente',
        descripcion: 'El sistema de respaldo automatizado está fallando desde hace una semana. Los backups no se están generando según el cronograma establecido.',
        ubicacion: {
          direccion: 'Centro de Datos Principal, Rack 15',
          ciudad: 'Quito',
          coordenadas: { latitud: -0.1807, longitud: -78.4678 }
        }
      },
      {
        idUsuario: 'user008',
        titulo: 'Falla en conexión de red fibra óptica',
        descripcion: 'La conexión de fibra óptica del edificio principal presenta intermitencias constantes afectando la conectividad de toda la organización.',
        ubicacion: {
          direccion: 'Edificio Corporativo, Sala de Telecomunicaciones',
          ciudad: 'Guayaquil',
          coordenadas: { latitud: -2.1894, longitud: -79.8890 }
        }
      }
    ];

    // Se recorre cada nuevo reporte y se crea usando callback
    for (const [index, nuevoReporte] of nuevosReportes.entries()) {
      await new Promise<void>((resolve) => {
        console.log(`Creando reporte ${index + 1}: "${nuevoReporte.titulo}"`);
        this.reporteService.crearReporte(nuevoReporte, (error, reporteCreado) => {
          if (error) {
            console.log(`❌ Error: ${error.message}`);
          } else if (reporteCreado) {
            console.log(`✅ Reporte creado exitosamente`);
            console.log(`   ID: ${reporteCreado.id}`);
            console.log(`   Estado inicial: ${reporteCreado.estado}`);
            console.log(`   Fecha: ${new Date(reporteCreado.fechaCreacion).toLocaleString()}`);
          }
          resolve();
        });
      });
      
      // Pequeña pausa para demostrar asincronía
      await this.pausa(200);
    }
  }

  /**
   * PROMISE PATTERN - Operación UPDATE
   * Demuestra la actualización usando Promises con .then() y .catch()
   */
  private async probarActualizacionConPromises(): Promise<void> {
    console.log('\n✏️  PRUEBA: ACTUALIZACIÓN CON PROMISES (UPDATE)');
    console.log('-'.repeat(45));

    // Obtener algunos reportes para actualizar
    const reportes = await this.reporteService.obtenerTodosLosReportes();
    const reportesParaActualizar = reportes.slice(0, 2);

    for (const reporte of reportesParaActualizar) {
      console.log(`Actualizando reporte: "${reporte.titulo}"`);
      
      const actualizaciones: ActualizarReporteDTO = {
        descripcion: reporte.descripcion + ' [ACTUALIZADO CON INFORMACIÓN ADICIONAL]',
        estado: this.obtenerSiguienteEstado(reporte.estado)
      };

      // Usar patrón Promise con .then() y .catch()
      await this.reporteService.actualizarReporte(reporte.id, actualizaciones)
        .then(reporteActualizado => {
          console.log(`✅ Reporte actualizado exitosamente`);
          console.log(`   Estado: ${reporte.estado} → ${reporteActualizado.estado}`);
          console.log(`   Fecha actualización: ${new Date(reporteActualizado.fechaActualizacion).toLocaleString()}`);
        })
        .catch(error => {
          console.log(`❌ Error en actualización: ${error.message}`);
        });

      await this.pausa(150);
    }
  }

  /**
   * ASYNC/AWAIT PATTERN - Operaciones READ
   * Demuestra consultas usando async/await
   */
  private async probarConsultasConAsyncAwait(): Promise<void> {
    console.log('\n📋 PRUEBA: CONSULTAS CON ASYNC/AWAIT (READ)');
    console.log('-'.repeat(45));

    try {
      // Consulta individual
      const reportes = await this.reporteService.obtenerTodosLosReportes();
      if (reportes.length > 0) {
        const primerReporte = reportes[0];
        console.log('Consultando reporte individual...');
        
        const reporteIndividual = await this.reporteService.obtenerReportePorId(primerReporte.id);
        if (reporteIndividual) {
          console.log(`✅ Reporte encontrado: "${reporteIndividual.titulo}"`);
          console.log(`   ID: ${reporteIndividual.id}`);
          console.log(`   Usuario: ${reporteIndividual.idUsuario}`);
        }
      }

      await this.pausa(100);

      // Consulta por estado
      console.log('\nConsultando reportes por estado...');
      const estadosParaConsultar = [EstadoReporte.PENDIENTE, EstadoReporte.EN_PROCESO];
      
      for (const estado of estadosParaConsultar) {
        const reportesPorEstado = await this.reporteService.obtenerReportesPorEstado(estado);
        console.log(`✅ Reportes en estado ${estado}: ${reportesPorEstado.length}`);
        
        reportesPorEstado.slice(0, 2).forEach(reporte => {
          console.log(`   - ${reporte.titulo}`);
        });
      }

      await this.pausa(100);

      // Consulta por usuario
      console.log('\nConsultando reportes por usuario...');
      const usuariosParaConsultar = ['user001', 'user002'];
      
      for (const usuario of usuariosParaConsultar) {
        const reportesPorUsuario = await this.reporteService.obtenerReportesPorUsuario(usuario);
        console.log(`✅ Reportes del usuario ${usuario}: ${reportesPorUsuario.length}`);
        
        reportesPorUsuario.forEach(reporte => {
          console.log(`   - ${reporte.titulo} (${reporte.estado})`);
        });
      }

    } catch (error) {
      console.log(`❌ Error en consultas: ${(error as Error).message}`);
    }
  }

  /**
   * ASYNC/AWAIT PATTERN - Operación DELETE
   * Demuestra eliminación con validaciones
   */
  private async probarEliminacionConAsyncAwait(): Promise<void> {
    console.log('\n🗑️  PRUEBA: ELIMINACIÓN CON ASYNC/AWAIT (DELETE)');
    console.log('-'.repeat(45));

    try {
      const reportes = await this.reporteService.obtenerTodosLosReportes();
      
      // Buscar reportes que puedan ser eliminados
      const reportesEliminables = reportes.filter(r => 
        r.estado === EstadoReporte.PENDIENTE || 
        r.estado === EstadoReporte.CERRADO ||
        r.estado === EstadoReporte.RECHAZADO
      );

      if (reportesEliminables.length > 0) {
        const reporteAEliminar = reportesEliminables[0];
        console.log(`Eliminando reporte: "${reporteAEliminar.titulo}"`);
        console.log(`Estado: ${reporteAEliminar.estado} (permitido para eliminación)`);
        
        const eliminado = await this.reporteService.eliminarReporte(reporteAEliminar.id);
        
        if (eliminado) {
          console.log('✅ Reporte eliminado exitosamente');
          
          // Verificar que ya no existe
          const verificacion = await this.reporteService.obtenerReportePorId(reporteAEliminar.id);
          if (!verificacion) {
            console.log('✅ Verificación: El reporte ya no existe en el sistema');
          }
        }
      } else {
        console.log('⚠️  No hay reportes en estado eliminable');
        console.log('   Solo se pueden eliminar reportes en estado PENDIENTE, CERRADO o RECHAZADO');
      }

      // Intentar eliminar un reporte en estado no eliminable
      const reporteNoEliminable = reportes.find(r => 
        r.estado === EstadoReporte.EN_PROCESO || r.estado === EstadoReporte.EN_REVISION
      );

      if (reporteNoEliminable) {
        console.log(`\nIntentando eliminar reporte en estado no eliminable...`);
        console.log(`Reporte: "${reporteNoEliminable.titulo}" (${reporteNoEliminable.estado})`);
        
        try {
          await this.reporteService.eliminarReporte(reporteNoEliminable.id);
        } catch (error) {
          console.log(`⚠️  Error esperado: ${(error as Error).message}`);
          console.log('   Esto demuestra las validaciones de negocio');
        }
      }

    } catch (error) {
      console.log(`❌ Error en eliminación: ${(error as Error).message}`);
    }
  }

  /**
   * Muestra estadísticas finales del sistema
   */
  private async mostrarEstadisticasFinales(): Promise<void> {
    console.log('\n📊 ESTADÍSTICAS FINALES DEL SISTEMA');
    console.log('-'.repeat(40));

    try {
      const estadisticas = await this.reporteService.obtenerEstadisticas();
      
      console.log(`Total de reportes en el sistema: ${estadisticas.total}`);
      console.log('\nDistribución por estado:');
      
      Object.entries(estadisticas.porEstado).forEach(([estado, cantidad]) => {
        if (cantidad > 0) {
          const barra = '█'.repeat(Math.max(1, Math.floor(cantidad / 2)));
          console.log(`  ${estado.padEnd(12)} : ${cantidad.toString().padStart(2)} ${barra}`);
        }
      });

      // Mostrar algunos reportes finales
      console.log('\nÚltimos reportes modificados:');
      const todosLosReportes = await this.reporteService.obtenerTodosLosReportes();
      const ultimosModificados = todosLosReportes
        .sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime())
        .slice(0, 3);

      ultimosModificados.forEach((reporte, index) => {
        console.log(`  ${index + 1}. ${reporte.titulo}`);
        console.log(`     Estado: ${reporte.estado} | Actualizado: ${new Date(reporte.fechaActualizacion).toLocaleString()}`);
      });

    } catch (error) {
      console.log(`❌ Error al generar estadísticas: ${(error as Error).message}`);
    }
  }

  /**
   * Métodos auxiliares
   */
  private obtenerSiguienteEstado(estadoActual: EstadoReporte): EstadoReporte {
    const transiciones: Record<EstadoReporte, EstadoReporte> = {
      [EstadoReporte.PENDIENTE]: EstadoReporte.EN_REVISION,
      [EstadoReporte.EN_REVISION]: EstadoReporte.EN_PROCESO,
      [EstadoReporte.EN_PROCESO]: EstadoReporte.RESUELTO,
      [EstadoReporte.RESUELTO]: EstadoReporte.CERRADO,
      [EstadoReporte.CERRADO]: EstadoReporte.CERRADO,
      [EstadoReporte.RECHAZADO]: EstadoReporte.PENDIENTE
    };

    return transiciones[estadoActual] || estadoActual;
  }

  private pausa(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Función principal que inicia el sistema de pruebas
 */
async function main(): Promise<void> {
  console.clear();
  
  const sistemaPruebas = new SistemaPruebasReportes();
  
  // Manejo de errores globales
  process.on('uncaughtException', (error) => {
    console.error('💥 EXCEPCIÓN NO CAPTURADA:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 PROMESA RECHAZADA NO MANEJADA:', reason);
    process.exit(1);
  });

  try {
    await sistemaPruebas.ejecutarTodasLasPruebas();
    
    console.log('\n🎯 DEMOSTRACIÓN COMPLETADA');
    console.log('='.repeat(30));
    console.log('✅ Arquitectura en capas implementada');
    console.log('✅ Callbacks aplicados en operación CREATE');
    console.log('✅ Promises aplicados en operación UPDATE');
    console.log('✅ Async/Await aplicado en operaciones READ y DELETE');
    console.log('✅ Validaciones de negocio y manejo de errores');
    console.log('✅ Datos de prueba realistas (10+ registros)');
    console.log('✅ Principios SOLID y DDD aplicados');
    
    console.log('\nPara ejecutar nuevamente: npm run dev');
    
  } catch (error) {
    console.error('\n💥 ERROR EN LA DEMOSTRACIÓN:');
    console.error((error as Error).message);
    process.exit(1);
  }
}

// Iniciar el programa
if (require.main === module) {
  main().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}