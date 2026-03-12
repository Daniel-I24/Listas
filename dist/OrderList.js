"use strict";
// Cllase Principal
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderList = void 0;
class OrderList {
    constructor() {
        // Lista privada: solo se accede mediante los métodos de la clase
        this.orders = [];
        this.nextId = 1;
    }
    // Crea y agrega un nuevo pedido al final de la lista (push)
    add(product, quantity) {
        const order = {
            id: this.nextId++,
            product,
            quantity,
            status: "requisition", // Todo pedido inicia en requisition
            quote: null,
            invoice: null,
            needsReview: false,
            createdAt: new Date(),
            log: ["📦 Shipping Office: Requisición preparada"],
        };
        this.orders.push(order); // Operación central de LISTAS
        return order;
    }
    // Busca un pedido recorriendo la lista por ID
    findById(id) {
        return this.orders.find((o) => o.id === id);
    }
    // Retorna una copia de la lista para evitar mutaciones externas
    getAll() {
        return [...this.orders];
    }
    // Elimina un pedido filtrando la lista por ID
    remove(id) {
        this.orders = this.orders.filter((o) => o.id !== id);
    }
    // Retorna el número de pedidos en la lista
    count() {
        return this.orders.length;
    }
    // Actualiza el estado de un pedido y registra el cambio en el log
    updateStatus(id, status, logEntry) {
        const order = this.findById(id);
        if (!order)
            return;
        order.status = status;
        order.log.push(logEntry);
    }
}
exports.OrderList = OrderList;
