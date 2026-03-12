"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIRenderer = void 0;
// Mapeo de estados
const STATUS_LABELS = {
    requisition: "📦 Requisición",
    quote_request: "📝 Solicitud RFQ",
    needs_supervisor: "🔍 Revisión Supervisor",
    quote_evaluation: "📋 Evaluación",
    review_quotation: "🏪 Seller Revisa",
    quote_preparation: "💰 Preparando Cotiz.",
    analyze_quote: "🔄 Analizando",
    actual_quote_review: "👁 Revisión Cotiz.",
    order_preparation: "🛒 Preparando Orden",
    order_review: "📄 Revisión Orden",
    fulfill_order: "✅ Cumpliendo",
    prepare_invoice: "🧾 Facturando",
    receive_product: "📬 Completado",
    cancelled: "❌ Cancelado",
};
class UIRenderer {
    constructor() {
        // IDs de los elementos del DOM que usa esta clase
        this.tableBodyId = "order-body";
        this.formId = "order-form";
        this.productId = "product";
        this.quantityId = "qty";
    }
    // Renderiza toda la tabla de pedidos a partir de la lista
    renderTable(list) {
        const tbody = document.getElementById(this.tableBodyId);
        if (!tbody)
            return;
        tbody.innerHTML = "";
        const orders = list.getAll();
        // Muestra mensaje vacío si no hay pedidos en la lista
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">
        Sin pedidos — crea uno con el formulario ↑</td></tr>`;
            return;
        }
        // Construye una fila por cada pedido de la lista
        orders.forEach((order) => this.renderRow(tbody, order));
    }
    // Construye una fila individual de la tabla (método privado)
    renderRow(tbody, order) {
        const isFinal = order.status === "receive_product" || order.status === "cancelled";
        const row = document.createElement("tr");
        row.dataset["id"] = String(order.id);
        row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>${order.product}</td>
      <td>${order.quantity}</td>
      <td><span class="badge ${order.status}">${STATUS_LABELS[order.status]}</span></td>
      <td>${order.quote != null ? "$" + order.quote.toFixed(2) : "—"}</td>
      <td>${order.invoice != null ? "$" + order.invoice.toFixed(2) : "—"}</td>
      <td class="actions">
        ${!isFinal
            ? `<button class="btn-advance" data-id="${order.id}">▶ Avanzar</button>`
            : ""}
        <button class="btn-log" data-id="${order.id}">📋 Log</button>
        <button class="btn-del" data-id="${order.id}">🗑</button>
      </td>`;
        tbody.appendChild(row);
    }
    // Limpia los campos del formulario después de crear un pedido
    resetForm() {
        const form = document.getElementById(this.formId);
        if (form)
            form.reset();
    }
    // Muestra el historial de pasos de un pedido en un alert
    showLog(order) {
        const steps = order.log.join("\n");
        alert(`📋 Historial — Pedido #${order.id}: ${order.product}\n\n${steps}`);
    }
    // Retorna el valor del campo producto del formulario
    getProductInput() {
        var _a, _b, _c;
        return (_c = (_b = (_a = document.getElementById(this.productId)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    }
    // Retorna el valor numérico del campo cantidad del formulario
    getQuantityInput() {
        var _a, _b;
        return parseInt((_b = (_a = document.getElementById(this.quantityId)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0");
    }
}
exports.UIRenderer = UIRenderer;
