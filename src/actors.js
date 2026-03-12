"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveAgent = exports.Seller = exports.Supervisor = exports.BuyerAgent = exports.ShippingOffice = void 0;
// Inicia el flujo 
var ShippingOffice = /** @class */ (function () {
    function ShippingOffice() {
    }
    // Crea un pedido en la lista 
    ShippingOffice.prototype.prepareRequisition = function (list, product, qty) {
        return list.add(product, qty);
    };
    return ShippingOffice;
}());
exports.ShippingOffice = ShippingOffice;
// Gestiona RFQ y revisa cotizaciones
var BuyerAgent = /** @class */ (function () {
    function BuyerAgent() {
    }
    BuyerAgent.prototype.prepareQuoteRequest = function (order, needsReview) {
        order.needsReview = needsReview;
        order.status = needsReview ? "needs_supervisor" : "review_quotation";
        var path = needsReview ? "→ Supervisor" : "→ Seller directo";
        order.log.push("\uD83E\uDDD1 Buyer Agent: RFQ enviado. \u00BFNecesita revisi\u00F3n? ".concat(needsReview ? "Sí " + path : "No " + path));
    };
    // Revisa la cotización enviada por el Seller
    BuyerAgent.prototype.reviewQuote = function (order, acceptable) {
        order.status = acceptable ? "order_preparation" : "analyze_quote";
        order.log.push(acceptable
            ? "🧑 Buyer Agent: Cotización aceptada ✅ → Preparando orden"
            : "🧑 Buyer Agent: Cotización rechazada 🔄 → Seller analiza respuesta");
    };
    return BuyerAgent;
}());
exports.BuyerAgent = BuyerAgent;
// Evalúa y aprueba o rechaza la solicitud
var Supervisor = /** @class */ (function () {
    function Supervisor() {
    }
    Supervisor.prototype.evaluate = function (order, approves) {
        order.status = approves ? "review_quotation" : "cancelled";
        order.log.push(approves
            ? "👔 Supervisor: Solicitud aprobada ✅ → Seller"
            : "👔 Supervisor: Solicitud rechazada ❌ → Cancelado");
    };
    return Supervisor;
}());
exports.Supervisor = Supervisor;
// Cotiza, revisa órdenes, cumple el pedido y factura
var Seller = /** @class */ (function () {
    function Seller() {
    }
    Seller.prototype.prepareQuote = function (order, decides, quoteValue) {
        if (!decides) {
            order.status = "cancelled";
            order.log.push("🏪 Seller: Decidió NO cotizar ❌ → Cancelado");
            return;
        }
        order.quote = quoteValue;
        order.status = "actual_quote_review";
        order.log.push("\uD83C\uDFEA Seller: Cotizaci\u00F3n preparada \u2192 $".concat(quoteValue.toFixed(2), " \u2192 Buyer Agent"));
    };
    // Revisa la orden recibida del Buyer Agent
    Seller.prototype.reviewOrder = function (order, acceptable) {
        if (!acceptable) {
            order.status = "actual_quote_review";
            order.log.push("🏪 Seller: Orden no aceptable → Cotización revisada enviada 🔄");
            return;
        }
        order.status = "fulfill_order";
        order.log.push("🏪 Seller: Orden aceptada ✅ → Cumpliendo pedido");
    };
    // Genera la factura con IVA del 19% sobre la cotización
    Seller.prototype.prepareInvoice = function (order) {
        var _a;
        order.invoice = ((_a = order.quote) !== null && _a !== void 0 ? _a : 0) * 1.19;
        order.status = "receive_product";
        order.log.push("\uD83C\uDFEA Seller: Factura generada \u2192 $".concat(order.invoice.toFixed(2), " (IVA 19%)"));
    };
    return Seller;
}());
exports.Seller = Seller;
// Recibe el producto final y el pago
var ReceiveAgent = /** @class */ (function () {
    function ReceiveAgent() {
    }
    ReceiveAgent.prototype.receiveProduct = function (order) {
        if (order.status !== "receive_product")
            return;
        order.log.push("📬 Receive Agent: Producto recibido y pago registrado ✅ COMPLETADO");
    };
    return ReceiveAgent;
}());
exports.ReceiveAgent = ReceiveAgent;
