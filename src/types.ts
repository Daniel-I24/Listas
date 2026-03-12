export type OrderStatus =
  | "requisition"          // Inicia el pedido
  | "quote_request"        // Solicita cotización (RFQ)
  | "needs_supervisor"     // Requiere revisión del supervisor
  | "quote_evaluation"     // Evalúa la solicitud
  | "review_quotation"     // Revisa la solicitud de cotización
  | "quote_preparation"    // Prepara la cotización
  | "analyze_quote"        // Analiza respuesta del Buyer
  | "actual_quote_review"  // Revisa la cotización real
  | "order_preparation"    // Prepara la orden de compra
  | "order_review"         // Revisa la orden recibida
  | "fulfill_order"        // Cumple la orden
  | "prepare_invoice"      // Prepara la factura
  | "receive_product"      // Recibe producto y pago
  | "cancelled";           // Cancelado en algún punto

// Estructura completa de un pedido dentro de la lista
export interface IOrder {
  id: number;
  product: string;
  quantity: number;
  status: OrderStatus;
  quote: number | null;    // Valor de cotización asignado por el Seller
  invoice: number | null;  // Factura generada al completar el pedido
  needsReview: boolean;    // Indica si el Buyer envió al Supervisor
  log: string[];           // Historial de pasos seguidos por el pedido
  createdAt: Date;         // Fecha de creación del pedido
}

// Contrato que deben cumplir todas las listas de pedidos
export interface IOrderList {
  add(product: string, quantity: number): IOrder;
  findById(id: number): IOrder | undefined;
  getAll(): IOrder[];
  remove(id: number): void;
  count(): number;
}