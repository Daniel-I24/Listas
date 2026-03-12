const STATUS_LABELS: Record<OrderStatus, string> = {
  requisition:         "📦 Requisición",
  quote_request:       "📝 Solicitud RFQ",
  needs_supervisor:    "🔍 Revisión Supervisor",
  quote_evaluation:    "📋 Evaluación",
  review_quotation:    "🏪 Seller Revisa",
  quote_preparation:   "💰 Preparando Cotiz.",
  analyze_quote:       "🔄 Analizando",
  actual_quote_review: "👁 Revisión Cotiz.",
  order_preparation:   "🛒 Preparando Orden",
  order_review:        "📄 Revisión Orden",
  fulfill_order:       "✅ Cumpliendo",
  prepare_invoice:     "🧾 Facturando",
  receive_product:     "📬 Completado",
  cancelled:           "❌ Cancelado",
};

class UIRenderer {
  private readonly tableBodyId = "order-body";
  private readonly formId      = "order-form";
  private readonly productId   = "product";
  private readonly quantityId  = "qty";

  renderTable(list: IOrderList): void {
    const tbody = document.getElementById(this.tableBodyId) as HTMLTableSectionElement;
    if (!tbody) return;
    tbody.innerHTML = "";
    const orders = list.getAll();
    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">Sin pedidos — crea uno con el formulario ↑</td></tr>`;
      return;
    }
    orders.forEach((order) => this.renderRow(tbody, order));
  }

  private renderRow(tbody: HTMLTableSectionElement, order: IOrder): void {
    const isFinal = order.status === "receive_product" || order.status === "cancelled";
    const row     = document.createElement("tr");
    row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>${order.product}</td>
      <td>${order.quantity}</td>
      <td><span class="badge ${order.status}">${STATUS_LABELS[order.status]}</span></td>
      <td>${order.quote   != null ? "$" + order.quote.toFixed(2)   : "—"}</td>
      <td>${order.invoice != null ? "$" + order.invoice.toFixed(2) : "—"}</td>
      <td class="actions">
        ${!isFinal ? `<button class="btn-advance" data-id="${order.id}">▶ Avanzar</button>` : ""}
        <button class="btn-log" data-id="${order.id}">📋 Log</button>
        <button class="btn-del" data-id="${order.id}">🗑</button>
      </td>`;
    tbody.appendChild(row);
  }

  resetForm(): void {
    const form = document.getElementById(this.formId) as HTMLFormElement;
    if (form) form.reset();
  }

  showLog(order: IOrder): void {
    alert(`📋 Historial — Pedido #${order.id}: ${order.product}\n\n${order.log.join("\n")}`);
  }

  getProductInput(): string {
    return (document.getElementById(this.productId) as HTMLInputElement)?.value?.trim() ?? "";
  }

  getQuantityInput(): number {
    return parseInt((document.getElementById(this.quantityId) as HTMLInputElement)?.value ?? "0");
  }
}