// Cllase Principal

import { IOrder, IOrderList, OrderStatus } from "./types";

export class OrderList implements IOrderList {
  // Lista privada: solo se accede mediante los métodos de la clase
  private orders: IOrder[] = [];
  private nextId: number = 1;

  // Crea y agrega un nuevo pedido al final de la lista (push)
  add(product: string, quantity: number): IOrder {
    const order: IOrder = {
      id:          this.nextId++,
      product,
      quantity,
      status:      "requisition",   // Todo pedido inicia en requisition
      quote:       null,
      invoice:     null,
      needsReview: false,
      createdAt:   new Date(),
      log:         ["📦 Shipping Office: Requisición preparada"],
    };
    this.orders.push(order);        // Operación central de LISTAS
    return order;
  }

  // Busca un pedido recorriendo la lista por ID
  findById(id: number): IOrder | undefined {
    return this.orders.find((o) => o.id === id);
  }

  // Retorna una copia de la lista para evitar mutaciones externas
  getAll(): IOrder[] {
    return [...this.orders];
  }

  // Elimina un pedido filtrando la lista por ID
  remove(id: number): void {
    this.orders = this.orders.filter((o) => o.id !== id);
  }

  // Retorna el número de pedidos en la lista
  count(): number {
    return this.orders.length;
  }

  // Actualiza el estado de un pedido y registra el cambio en el log
  updateStatus(id: number, status: OrderStatus, logEntry: string): void {
    const order = this.findById(id);
    if (!order) return;
    order.status = status;
    order.log.push(logEntry);
  }
}