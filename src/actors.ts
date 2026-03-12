
import { IOrder, IOrderList } from "./types";

// Inicia el flujo 
export class ShippingOffice {
  // Crea un pedido en la lista 
  prepareRequisition(list: IOrderList, product: string, qty: number): IOrder {
    return list.add(product, qty);
  }
}

// Gestiona RFQ y revisa cotizaciones
export class BuyerAgent {
  prepareQuoteRequest(order: IOrder, needsReview: boolean): void {
    order.needsReview = needsReview;
    order.status      = needsReview ? "needs_supervisor" : "review_quotation";
    const path        = needsReview ? "→ Supervisor" : "→ Seller directo";
    order.log.push(`🧑 Buyer Agent: RFQ enviado. ¿Necesita revisión? ${needsReview ? "Sí " + path : "No " + path}`);
  }

  // Revisa la cotización enviada por el Seller
  reviewQuote(order: IOrder, acceptable: boolean): void {
    order.status = acceptable ? "order_preparation" : "analyze_quote";
    order.log.push(
      acceptable
        ? "🧑 Buyer Agent: Cotización aceptada ✅ → Preparando orden"
        : "🧑 Buyer Agent: Cotización rechazada 🔄 → Seller analiza respuesta"
    );
  }
}

// Evalúa y aprueba o rechaza la solicitud
export class Supervisor {
  evaluate(order: IOrder, approves: boolean): void {
    order.status = approves ? "review_quotation" : "cancelled";
    order.log.push(
      approves
        ? "👔 Supervisor: Solicitud aprobada ✅ → Seller"
        : "👔 Supervisor: Solicitud rechazada ❌ → Cancelado"
    );
  }
}

// Cotiza, revisa órdenes, cumple el pedido y factura
export class Seller {
  prepareQuote(order: IOrder, decides: boolean, quoteValue: number): void {
    if (!decides) {
      order.status = "cancelled";
      order.log.push("🏪 Seller: Decidió NO cotizar ❌ → Cancelado");
      return;
    }
    order.quote  = quoteValue;
    order.status = "actual_quote_review";
    order.log.push(`🏪 Seller: Cotización preparada → $${quoteValue.toFixed(2)} → Buyer Agent`);
  }

  // Revisa la orden recibida del Buyer Agent
  reviewOrder(order: IOrder, acceptable: boolean): void {
    if (!acceptable) {
      order.status = "actual_quote_review";
      order.log.push("🏪 Seller: Orden no aceptable → Cotización revisada enviada 🔄");
      return;
    }
    order.status = "fulfill_order";
    order.log.push("🏪 Seller: Orden aceptada ✅ → Cumpliendo pedido");
  }

  // Genera la factura con IVA del 19% sobre la cotización
  prepareInvoice(order: IOrder): void {
    order.invoice = (order.quote ?? 0) * 1.19;
    order.status  = "receive_product";
    order.log.push(`🏪 Seller: Factura generada → $${order.invoice.toFixed(2)} (IVA 19%)`);
  }
}

// Recibe el producto final y el pago
export class ReceiveAgent {
  receiveProduct(order: IOrder): void {
    if (order.status !== "receive_product") return;
    order.log.push("📬 Receive Agent: Producto recibido y pago registrado ✅ COMPLETADO");
  }
}