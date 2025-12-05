// src/pages/MyOrdersPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getOrders, getOrderById } from '../api/orders';
import { formatPriceUSD } from '../utils/formatPrice';

interface OrderDetail {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: {
    id: number;
    nombre: string;
    imagen: string | null;
    precio: number;
  };
}

interface Order {
  id: number;
  pedido_numero: string;
  user_id: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  created_at: string;
  fecha_pedido?: string;
  productos_cantidad: number;
  detalles?: OrderDetail[];
}

const STATUS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  confirmado: {
    label: 'Confirmado',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  enviado: {
    label: 'En Camino',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  entregado: {
    label: 'Entregado',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelado: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      
      // Los pedidos ya vienen del endpoint /pedidos con el filtro del backend
      // El backend filtra automáticamente por user_id si no es admin
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('No se pudieron cargar tus pedidos. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = async (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      
      // Cargar detalles si no están cargados
      const order = orders.find(o => o.id === orderId);
      if (order && !order.detalles) {
        try {
          const response = await getOrderById(orderId);
          const orderData = response.data;
          
          setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, detalles: orderData.detalles } : o
          ));
        } catch (err) {
          console.error('Error al cargar detalles:', err);
        }
      }
    }
    
    setExpandedOrders(newExpanded);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Mis Pedidos</h1>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">No tienes pedidos aún</h2>
          <p className="text-slate-600 mb-6">Explora nuestra tienda y realiza tu primera compra</p>
          <button
            onClick={() => navigate('/productos')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Mis Pedidos</h1>
        <p className="text-slate-600">Revisa el estado y detalles de tus compras</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusConfig = STATUS_CONFIG[order.estado];
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedOrders.has(order.id);
          const orderDate = new Date(order.created_at || order.fecha_pedido || '');
          const productCount = order.productos_cantidad || order.detalles?.length || 0;

          return (
            <div
              key={order.id}
              className={`bg-white rounded-xl border ${statusConfig.borderColor} shadow-sm overflow-hidden`}
            >
              {/* Header del pedido */}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Pedido #{order.pedido_numero}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                        <StatusIcon size={16} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {orderDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{formatPriceUSD(order.total)}</p>
                    <p className="text-sm text-slate-600">{productCount} producto{productCount === 1 ? '' : 's'}</p>
                  </div>
                </div>

                {/* Botón expandir/contraer */}
                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={20} />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <ChevronDown size={20} />
                      Ver detalles
                    </>
                  )}
                </button>
              </div>

              {/* Detalles expandibles */}
              {isExpanded && order.detalles && (
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                  <h4 className="font-semibold text-slate-800 mb-4">Productos en este pedido:</h4>
                  <div className="space-y-3">
                    {order.detalles.map((detalle) => (
                      <div
                        key={detalle.id}
                        className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200"
                      >
                        <img
                          src={detalle.producto?.imagen || '/placeholder.png'}
                          alt={detalle.producto?.nombre || 'Producto'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-800">
                            {detalle.producto?.nombre || 'Producto'}
                          </h5>
                          <p className="text-sm text-slate-600">
                            Cantidad: {detalle.cantidad} × {formatPriceUSD(detalle.precio_unitario)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            {formatPriceUSD(detalle.subtotal || (detalle.precio_unitario * detalle.cantidad))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
