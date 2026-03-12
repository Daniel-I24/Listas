"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIRenderer = void 0;
// Mapeo de estados
var STATUS_LABELS = {
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
var UIRenderer = /** @class */ (function () {
    function UIRenderer() {
        // IDs de los elementos del DOM que usa esta clase
        this.tableBodyId = "order-body";
        this.formId = "order-form";
        this.productId = "product";
        this.quantityId = "qty";
    }
    // Renderiza toda la tabla de pedidos a partir de la lista
    UIRenderer.prototype.renderTable = function (list) {
        var _this = this;
        var tbody = document.getElementById(this.tableBodyId);
        if (!tbody)
            return;
        tbody.innerHTML = "";
        var orders = list.getAll();
        // Muestra mensaje vacío si no hay pedidos en la lista
        if (orders.length === 0) {
            tbody.innerHTML = "<tr><td colspan=\"7\" class=\"empty-msg\">\n        Sin pedidos \u2014 crea uno con el formulario \u2191</td></tr>";
            return;
        }
        // Construye una fila por cada pedido de la lista
        orders.forEach(function (order) { return _this.renderRow(tbody, order); });
    };
    // Construye una fila individual de la tabla (método privado)
    UIRenderer.prototype.renderRow = function (tbody, order) {
        var isFinal = order.status === "receive_product" || order.status === "cancelled";
        var row = document.createElement("tr");
        row.dataset["id"] = String(order.id);
        row.innerHTML = "\n      <td><strong>#".concat(order.id, "</strong></td>\n      <td>").concat(order.product, "</td>\n      <td>").concat(order.quantity, "</td>\n      <td><span class=\"badge ").concat(order.status, "\">").concat(STATUS_LABELS[order.status], "</span></td>\n      <td>").concat(order.quote != null ? "$" + order.quote.toFixed(2) : "—", "</td>\n      <td>").concat(order.invoice != null ? "$" + order.invoice.toFixed(2) : "—", "</td>\n      <td class=\"actions\">\n        ").concat(!isFinal
            ? "<button class=\"btn-advance\" data-id=\"".concat(order.id, "\">\u25B6 Avanzar</button>")
            : "", "\n        <button class=\"btn-log\" data-id=\"").concat(order.id, "\">\uD83D\uDCCB Log</button>\n        <button class=\"btn-del\" data-id=\"").concat(order.id, "\">\uD83D\uDDD1</button>\n      </td>");
        tbody.appendChild(row);
    };
    // Limpia los campos del formulario después de crear un pedido
    UIRenderer.prototype.resetForm = function () {
        var form = document.getElementById(this.formId);
        if (form)
            form.reset();
    };
    // Muestra el historial de pasos de un pedido en un alert
    UIRenderer.prototype.showLog = function (order) {
        var steps = order.log.join("\n");
        alert("\uD83D\uDCCB Historial \u2014 Pedido #".concat(order.id, ": ").concat(order.product, "\n\n").concat(steps));
    };
    // Retorna el valor del campo producto del formulario
    UIRenderer.prototype.getProductInput = function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = document.getElementById(this.productId)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
    };
    // Retorna el valor numérico del campo cantidad del formulario
    UIRenderer.prototype.getQuantityInput = function () {
        var _a, _b;
        return parseInt((_b = (_a = document.getElementById(this.quantityId)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0");
    };
    return UIRenderer;
}());
exports.UIRenderer = UIRenderer;
