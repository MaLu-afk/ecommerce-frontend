import type { Product } from '../../types/product'

interface SpecificationsTableProps {
  readonly product: Product
  readonly productName: string
}

type CaracteristicasValue = string | number | boolean | string[] | null | undefined
type CaracteristicasRecord = Record<string, CaracteristicasValue>

/**
 * Tabla de especificaciones técnicas del producto
 * 
 * Lee las especificaciones directamente del campo JSON 'especificaciones' de la base de datos.
 * Esto permite que cada producto tenga características completamente dinámicas sin
 * necesidad de una estructura fija predefinida.
 * 
 * Características:
 * - Parsing automático de JSON desde el campo 'especificaciones'
 * - Formateo inteligente de valores (strings, números, booleanos)
 * - Organización automática por secciones si están definidas
 * - Estados vacíos manejados elegantemente
 * - Responsive design para móviles y desktop
 * 
 * Conceptos importantes:
 * - **Dynamic Data Structure**: Adaptación a cualquier estructura JSON
 * - **Safe JSON Parsing**: Manejo seguro de errores de parsing
 * - **Type Guards**: Verificación de tipos para robustez
 * - **Semantic HTML**: Uso de elementos semánticamente correctos
 */
export default function SpecificationsTable({ product, productName }: SpecificationsTableProps) {
  
  // Función para parsear el campo JSON 'especificaciones'
  const parseEspecificaciones = (especificaciones: Product['especificaciones']): CaracteristicasRecord | null => {
    if (!especificaciones) return null;
    
    // Si ya es un objeto, lo devolvemos directamente
    if (typeof especificaciones === 'object') {
      return especificaciones as CaracteristicasRecord;
    }
    
    // Si es un string, intentamos parsearlo como JSON
    if (typeof especificaciones === 'string') {
      try {
        const parsed = JSON.parse(especificaciones);
        return typeof parsed === 'object' && parsed !== null ? parsed : null;
      } catch (error) {
        console.warn('Error parsing especificaciones JSON:', error);
        return null;
      }
    }
    
    return null;
  };

  // Obtener las especificaciones parseadas
  const especificaciones = parseEspecificaciones(product.especificaciones);

  // Guard clause para datos nulos o vacíos
  if (!especificaciones || Object.keys(especificaciones).length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 text-center">
        <p className="text-slate-600">No hay especificaciones disponibles para este producto.</p>
      </div>
    );
  }

  // Helper para formatear valores según su tipo
  const formatValue = (value: unknown, key?: string): string => {
    if (value === null || value === undefined) {
      return 'No especificado'
    }
    
    if (typeof value === 'string') {
      return value.trim() || 'No especificado'
    }
    
    if (typeof value === 'number') {
      // No formatear como precio si es claramente un año
      const currentYear = new Date().getFullYear()
      if (key && (
        key.toLowerCase().includes('año') || 
        key.toLowerCase().includes('year') ||
        key.toLowerCase().includes('lanzamiento')
      ) && value >= 1900 && value <= currentYear + 10) {
        return value.toString()
      }
      
      // No formatear como precio si es un valor pequeño o entero que parece ser medida/cantidad
      if (key && (
        key.toLowerCase().includes('peso') ||
        key.toLowerCase().includes('batería') ||
        key.toLowerCase().includes('mah') ||
        key.toLowerCase().includes('wh') ||
        key.toLowerCase().includes('horas') ||
        key.toLowerCase().includes('días') ||
        key.toLowerCase().includes('botones') ||
        key.toLowerCase().includes('núcleos') ||
        key.toLowerCase().includes('dpi') ||
        key.toLowerCase().includes('drivers') ||
        key.toLowerCase().includes('mm') ||
        key.toLowerCase().includes('min') ||
        key.toLowerCase().includes('kg') ||
        key.toLowerCase().includes('g') ||
        key.toLowerCase().includes('pulgadas') ||
        key.toLowerCase().includes('inch') ||
        key.toLowerCase().includes('ghz') ||
        key.toLowerCase().includes('gb') ||
        key.toLowerCase().includes('mb') ||
        key.toLowerCase().includes('tb')
      )) {
        return value.toString()
      }
      
      return value.toString()
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No'
    }
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return typeof value === 'string' ? value : 'No especificado'
  }

  // Helper para renderizar una sección de especificaciones
  const renderSpecificationSection = (
    title: string,
    specs: CaracteristicasRecord | CaracteristicasValue
  ) => {
    // Si specs no es un objeto, intentamos convertirlo o devolvemos null
    if (!specs || typeof specs !== 'object' || Array.isArray(specs)) {
      return null
    }

    const specsRecord = specs
    if (Object.keys(specsRecord).length === 0) {
      return null
    }

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
          {title}
        </h3>
        <dl className="space-y-2">
          {Object.entries(specsRecord).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2">
              <dt className="font-medium text-slate-700 sm:w-1/3 mb-1 sm:mb-0">
                {key}:
              </dt>
              <dd className="text-slate-600 sm:w-2/3 sm:text-right">
                {formatValue(value, key)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  // Detectar si hay secciones organizadas o si es una estructura plana
  const hasOrganizedSections = especificaciones.caracteristicas_principales || especificaciones.otros;

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Especificaciones Técnicas
        </h2>
        <p className="text-slate-600 text-sm">
          Información detallada sobre las características de {productName}
        </p>
      </div>

      {hasOrganizedSections ? (
        // Renderizar secciones organizadas
        <>
          {especificaciones.caracteristicas_principales && 
            typeof especificaciones.caracteristicas_principales === 'object' &&
            !Array.isArray(especificaciones.caracteristicas_principales) &&
            renderSpecificationSection('Características Principales', especificaciones.caracteristicas_principales)
          }
          {especificaciones.otros && 
            typeof especificaciones.otros === 'object' &&
            !Array.isArray(especificaciones.otros) &&
            renderSpecificationSection('Especificaciones Adicionales', especificaciones.otros)
          }
        </>
      ) : (
        // Renderizar estructura plana
        renderSpecificationSection('Especificaciones', especificaciones)
      )}
      

    </div>
  )
}