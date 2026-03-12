"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveAgent = exports.Seller = exports.Supervisor = exports.BuyerAgent = exports.ShippingOffice = void 0;
// Inicia el flujo 
class ShippingOffice {
    // Crea un pedido en la lista 
    prepareRequisition(list, product, qty) {
        return list.add(product, qty);
    }
}
exports.ShippingOffice = ShippingOffice;
// Gestiona RFQ y revisa cotizaciones
class BuyerAgent {
    prepareQuoteRequest(order, needsReview) {
        order.needsReview = needsReview;
        order.status = needsReview ? "needs_supervisor" : "review_quotation";
        const path = needsReview ? "→ Supervisor" : "→ Seller directo";
        order.log.push(`🧑 Buyer Agent: RFQ enviado. ¿Necesita revisión? ${needsReview ? "Sí " + path : "No " + path}`);
    }
    // Revisa la cotización enviada por el Seller
    reviewQuote(order, acceptable) {
        order.status = acceptable ? "order_preparation" : "analyze_quote";
        order.log.push(acceptable
            ? "🧑 Buyer Agent: Cotización aceptada ✅ → Preparando orden"
            : "🧑 Buyer Agent: Cotización rechazada 🔄 → Seller analiza respuesta");
    }
}
exports.BuyerAgent = BuyerAgent;
// Evalúa y aprueba o rechaza la solicitud
class Supervisor {
    evaluate(order, approves) {
        order.status = approves ? "review_quotation" : "cancelled";
        order.log.push(approves
            ? "👔 Supervisor: Solicitud aprobada ✅ → Seller"
            : "👔 Supervisor: Solicitud rechazada ❌ → Cancelado");
    }
}
exports.Supervisor = Supervisor;
// Cotiza, revisa órdenes, cumple el pedido y factura
class Seller {
    prepareQuote(order, decides, quoteValue) {
        if (!decides) {
            order.status = "cancelled";
            order.log.push("🏪 Seller: Decidió NO cotizar ❌ → Cancelado");
            return;
        }
        order.quote = quoteValue;
        order.status = "actual_quote_review";
        order.log.push(`🏪 Seller: Cotización preparada → $${quoteValue.toFixed(2)} → Buyer Agent`);
    }
    // Revisa la orden recibida del Buyer Agent
    reviewOrder(order, acceptable) {
        if (!acceptable) {
            order.status = "actual_quote_review";
            order.log.push("🏪 Seller: Orden no aceptable → Cotización revisada enviada 🔄");
            return;
        }
        order.status = "fulfill_order";
        order.log.push("🏪 Seller: Orden aceptada ✅ → Cumpliendo pedido");
    }
    // Genera la factura con IVA del 19% sobre la cotización
    prepareInvoice(order) {
        var _a;
        order.invoice = ((_a = order.quote) !== null && _a !== void 0 ? _a : 0) * 1.19;
        order.status = "receive_product";
        order.log.push(`🏪 Seller: Factura generada → $${order.invoice.toFixed(2)} (IVA 19%)`);
    }
}
exports.Seller = Seller;
// Recibe el producto final y el pago
class ReceiveAgent {
    receiveProduct(order) {
        if (order.status !== "receive_product")
            return;
        order.log.push("📬 Receive Agent: Producto recibido y pago registrado ✅ COMPLETADO");
    }
}
exports.ReceiveAgent = ReceiveAgent;
