class ShippingOffice {
  prepareRequisition(list: IOrderList, product: string, qty: number): IOrder {
    return list.add(product, qty);
  }
}

class BuyerAgent {
  prepareQuoteRequest(order: IOrder, needsReview: boolean): void {
    order.needsReview = needsReview;
    order.status      = needsReview ? "needs_supervisor" : "review_quotation";
    const path        = needsReview ? "→ Supervisor" : "→ Seller directo";
    order.log.push(`🧑 Buyer Agent: RFQ enviado. ¿Necesita revisión? ${needsReview ? "Sí " + path : "No " + path}`);
  }

  reviewQuote(order: IOrder, acceptable: boolean): void {
    order.status = acceptable ? "order_preparation" : "analyze_quote";
    order.log.push(
      acceptable
        ? "🧑 Buyer Agent: Cotización aceptada ✅ → Preparando orden"
        : "🧑 Buyer Agent: Cotización rechazada 🔄 → Seller analiza respuesta"
    );
  }
}

class Supervisor {
  evaluate(order: IOrder, approves: boolean): void {
    order.status = approves ? "review_quotation" : "cancelled";
    order.log.push(
      approves
        ? "👔 Supervisor: Solicitud aprobada ✅ → Seller"
        : "👔 Supervisor: Solicitud rechazada ❌ → Cancelado"
    );
  }
}

class Seller {
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

  reviewOrder(order: IOrder, acceptable: boolean): void {
    if (!acceptable) {
      order.status = "actual_quote_review";
      order.log.push("🏪 Seller: Orden no aceptable → Cotización revisada enviada 🔄");
      return;
    }
    order.status = "fulfill_order";
    order.log.push("🏪 Seller: Orden aceptada ✅ → Cumpliendo pedido");
  }

  prepareInvoice(order: IOrder): void {
    order.invoice = (order.quote ?? 0) * 1.19;
    order.status  = "receive_product";
    order.log.push(`🏪 Seller: Factura generada → $${order.invoice.toFixed(2)} (IVA 19%)`);
  }
}

class ReceiveAgent {
  receiveProduct(order: IOrder): void {
    if (order.status !== "receive_product") return;
    order.log.push("📬 Receive Agent: Producto recibido y pago registrado ✅ COMPLETADO");
  }
}