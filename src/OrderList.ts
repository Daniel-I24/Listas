class OrderList implements IOrderList {
  private orders: IOrder[] = [];
  private nextId: number = 1;

  add(product: string, quantity: number): IOrder {
    const order: IOrder = {
      id:          this.nextId++,
      product,
      quantity,
      status:      "requisition",
      quote:       null,
      invoice:     null,
      needsReview: false,
      createdAt:   new Date(),
      log:         ["📦 Shipping Office: Requisición preparada"],
    };
    this.orders.push(order);
    return order;
  }

  findById(id: number): IOrder | undefined {
    return this.orders.find((o) => o.id === id);
  }

  getAll(): IOrder[] {
    return [...this.orders];
  }

  remove(id: number): void {
    this.orders = this.orders.filter((o) => o.id !== id);
  }

  count(): number {
    return this.orders.length;
  }

  updateStatus(id: number, status: OrderStatus, logEntry: string): void {
    const order = this.findById(id);
    if (!order) return;
    order.status = status;
    order.log.push(logEntry);
  }
}