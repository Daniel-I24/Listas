class App {
    constructor() {
        this.list = new OrderList();
        this.ui = new UIRenderer();
        this.shipping = new ShippingOffice();
        this.buyer = new BuyerAgent();
        this.supervisor = new Supervisor();
        this.seller = new Seller();
        this.receiver = new ReceiveAgent();
    }
    init() {
        document.getElementById("order-form")
            .addEventListener("submit", (e) => this.handleCreate(e));
        document.getElementById("order-body")
            .addEventListener("click", (e) => this.handleTableClick(e));
        this.ui.renderTable(this.list);
    }
    handleCreate(e) {
        e.preventDefault();
        const product = this.ui.getProductInput();
        const quantity = this.ui.getQuantityInput();
        if (!product || quantity < 1)
            return;
        this.shipping.prepareRequisition(this.list, product, quantity);
        this.ui.resetForm();
        this.ui.renderTable(this.list);
    }
    handleTableClick(e) {
        var _a;
        const target = e.target;
        const id = parseInt((_a = target.dataset["id"]) !== null && _a !== void 0 ? _a : "0");
        if (!id)
            return;
        if (target.classList.contains("btn-advance"))
            this.advance(id);
        if (target.classList.contains("btn-log"))
            this.showLog(id);
        if (target.classList.contains("btn-del"))
            this.delete(id);
    }
    advance(id) {
        var _a;
        const order = this.list.findById(id);
        if (!order)
            return;
        switch (order.status) {
            case "requisition":
                order.status = "quote_request";
                order.log.push("🧑 Buyer Agent: Preparando solicitud RFQ");
                break;
            case "quote_request": {
                const needs = confirm(`Pedido #${order.id}: ¿Necesita revisión del Supervisor?`);
                this.buyer.prepareQuoteRequest(order, needs);
                break;
            }
            case "needs_supervisor": {
                const ok = confirm(`Supervisor: ¿Aprobar solicitud del pedido #${order.id}?`);
                this.supervisor.evaluate(order, ok);
                break;
            }
            case "review_quotation": {
                const decide = confirm(`Seller: ¿Decide cotizar el pedido #${order.id}?`);
                const val = decide
                    ? parseFloat(prompt("Seller: Ingresa el valor de cotización ($):") || "0")
                    : 0;
                this.seller.prepareQuote(order, decide, val);
                break;
            }
            case "analyze_quote":
                order.status = "actual_quote_review";
                order.log.push("🏪 Seller: Cotización revisada reenviada 🔄");
                break;
            case "actual_quote_review": {
                const accept = confirm(`Buyer Agent: ¿Cotización $${order.quote} aceptable para pedido #${order.id}?`);
                this.buyer.reviewQuote(order, accept);
                break;
            }
            case "order_preparation":
                order.status = "order_review";
                order.log.push("🧑 Buyer Agent: Orden enviada al Seller");
                break;
            case "order_review": {
                const ok = confirm(`Seller: ¿Aceptar la orden #${order.id}?`);
                this.seller.reviewOrder(order, ok);
                break;
            }
            case "fulfill_order":
                this.seller.prepareInvoice(order);
                break;
            case "receive_product":
                this.receiver.receiveProduct(order);
                alert(`✅ Pedido #${order.id} completado\nFactura: $${(_a = order.invoice) === null || _a === void 0 ? void 0 : _a.toFixed(2)}`);
                break;
        }
        this.ui.renderTable(this.list);
    }
    showLog(id) {
        const order = this.list.findById(id);
        if (order)
            this.ui.showLog(order);
    }
    delete(id) {
        if (!confirm(`¿Eliminar pedido #${id}?`))
            return;
        this.list.remove(id);
        this.ui.renderTable(this.list);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new App().init();
});
class OrderList {
    constructor() {
        this.orders = [];
        this.nextId = 1;
    }
    add(product, quantity) {
        const order = {
            id: this.nextId++,
            product,
            quantity,
            status: "requisition",
            quote: null,
            invoice: null,
            needsReview: false,
            createdAt: new Date(),
            log: ["📦 Shipping Office: Requisición preparada"],
        };
        this.orders.push(order);
        return order;
    }
    findById(id) {
        return this.orders.find((o) => o.id === id);
    }
    getAll() {
        return [...this.orders];
    }
    remove(id) {
        this.orders = this.orders.filter((o) => o.id !== id);
    }
    count() {
        return this.orders.length;
    }
    updateStatus(id, status, logEntry) {
        const order = this.findById(id);
        if (!order)
            return;
        order.status = status;
        order.log.push(logEntry);
    }
}
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
        this.tableBodyId = "order-body";
        this.formId = "order-form";
        this.productId = "product";
        this.quantityId = "qty";
    }
    renderTable(list) {
        const tbody = document.getElementById(this.tableBodyId);
        if (!tbody)
            return;
        tbody.innerHTML = "";
        const orders = list.getAll();
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-msg">Sin pedidos — crea uno con el formulario ↑</td></tr>`;
            return;
        }
        orders.forEach((order) => this.renderRow(tbody, order));
    }
    renderRow(tbody, order) {
        const isFinal = order.status === "receive_product" || order.status === "cancelled";
        const row = document.createElement("tr");
        row.innerHTML = `
      <td><strong>#${order.id}</strong></td>
      <td>${order.product}</td>
      <td>${order.quantity}</td>
      <td><span class="badge ${order.status}">${STATUS_LABELS[order.status]}</span></td>
      <td>${order.quote != null ? "$" + order.quote.toFixed(2) : "—"}</td>
      <td>${order.invoice != null ? "$" + order.invoice.toFixed(2) : "—"}</td>
      <td class="actions">
        ${!isFinal ? `<button class="btn-advance" data-id="${order.id}">▶ Avanzar</button>` : ""}
        <button class="btn-log" data-id="${order.id}">📋 Log</button>
        <button class="btn-del" data-id="${order.id}">🗑</button>
      </td>`;
        tbody.appendChild(row);
    }
    resetForm() {
        const form = document.getElementById(this.formId);
        if (form)
            form.reset();
    }
    showLog(order) {
        alert(`📋 Historial — Pedido #${order.id}: ${order.product}\n\n${order.log.join("\n")}`);
    }
    getProductInput() {
        var _a, _b, _c;
        return (_c = (_b = (_a = document.getElementById(this.productId)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    }
    getQuantityInput() {
        var _a, _b;
        return parseInt((_b = (_a = document.getElementById(this.quantityId)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0");
    }
}
class ShippingOffice {
    prepareRequisition(list, product, qty) {
        return list.add(product, qty);
    }
}
class BuyerAgent {
    prepareQuoteRequest(order, needsReview) {
        order.needsReview = needsReview;
        order.status = needsReview ? "needs_supervisor" : "review_quotation";
        const path = needsReview ? "→ Supervisor" : "→ Seller directo";
        order.log.push(`🧑 Buyer Agent: RFQ enviado. ¿Necesita revisión? ${needsReview ? "Sí " + path : "No " + path}`);
    }
    reviewQuote(order, acceptable) {
        order.status = acceptable ? "order_preparation" : "analyze_quote";
        order.log.push(acceptable
            ? "🧑 Buyer Agent: Cotización aceptada ✅ → Preparando orden"
            : "🧑 Buyer Agent: Cotización rechazada 🔄 → Seller analiza respuesta");
    }
}
class Supervisor {
    evaluate(order, approves) {
        order.status = approves ? "review_quotation" : "cancelled";
        order.log.push(approves
            ? "👔 Supervisor: Solicitud aprobada ✅ → Seller"
            : "👔 Supervisor: Solicitud rechazada ❌ → Cancelado");
    }
}
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
    reviewOrder(order, acceptable) {
        if (!acceptable) {
            order.status = "actual_quote_review";
            order.log.push("🏪 Seller: Orden no aceptable → Cotización revisada enviada 🔄");
            return;
        }
        order.status = "fulfill_order";
        order.log.push("🏪 Seller: Orden aceptada ✅ → Cumpliendo pedido");
    }
    prepareInvoice(order) {
        var _a;
        order.invoice = ((_a = order.quote) !== null && _a !== void 0 ? _a : 0) * 1.19;
        order.status = "receive_product";
        order.log.push(`🏪 Seller: Factura generada → $${order.invoice.toFixed(2)} (IVA 19%)`);
    }
}
class ReceiveAgent {
    receiveProduct(order) {
        if (order.status !== "receive_product")
            return;
        order.log.push("📬 Receive Agent: Producto recibido y pago registrado ✅ COMPLETADO");
    }
}
