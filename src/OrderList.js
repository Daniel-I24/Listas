"use strict";
// Cllase Principal
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderList = void 0;
var OrderList = /** @class */ (function () {
    function OrderList() {
        // Lista privada: solo se accede mediante los métodos de la clase
        this.orders = [];
        this.nextId = 1;
    }
    // Crea y agrega un nuevo pedido al final de la lista (push)
    OrderList.prototype.add = function (product, quantity) {
        var order = {
            id: this.nextId++,
            product: product,
            quantity: quantity,
            status: "requisition", // Todo pedido inicia en requisition
            quote: null,
            invoice: null,
            needsReview: false,
            createdAt: new Date(),
            log: ["📦 Shipping Office: Requisición preparada"],
        };
        this.orders.push(order); // Operación central de LISTAS
        return order;
    };
    // Busca un pedido recorriendo la lista por ID
    OrderList.prototype.findById = function (id) {
        return this.orders.find(function (o) { return o.id === id; });
    };
    // Retorna una copia de la lista para evitar mutaciones externas
    OrderList.prototype.getAll = function () {
        return __spreadArray([], this.orders, true);
    };
    // Elimina un pedido filtrando la lista por ID
    OrderList.prototype.remove = function (id) {
        this.orders = this.orders.filter(function (o) { return o.id !== id; });
    };
    // Retorna el número de pedidos en la lista
    OrderList.prototype.count = function () {
        return this.orders.length;
    };
    // Actualiza el estado de un pedido y registra el cambio en el log
    OrderList.prototype.updateStatus = function (id, status, logEntry) {
        var order = this.findById(id);
        if (!order)
            return;
        order.status = status;
        order.log.push(logEntry);
    };
    return OrderList;
}());
exports.OrderList = OrderList;
