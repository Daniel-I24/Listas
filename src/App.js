"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var OrderList_1 = require("./OrderList");
var UIRenderer_1 = require("./UIRenderer");
var actors_1 = require("./actors");
var App = /** @class */ (function () {
    function App() {
        // Instancias de todos los componentes del sistema
        this.list = new OrderList_1.OrderList();
        this.ui = new UIRenderer_1.UIRenderer();
        this.shipping = new actors_1.ShippingOffice();
        this.buyer = new actors_1.BuyerAgent();
        this.supervisor = new actors_1.Supervisor();
        this.seller = new actors_1.Seller();
        this.receiver = new actors_1.ReceiveAgent();
    }
    // Inicializa la app
    App.prototype.init = function () {
        var _this = this;
        document.getElementById("order-form")
            .addEventListener("submit", function (e) { return _this.handleCreate(e); });
        // Delegación de eventos
        document.getElementById("order-body")
            .addEventListener("click", function (e) { return _this.handleTableClick(e); });
        this.ui.renderTable(this.list);
    };
    // Maneja la creación de un nuevo pedido desde el formulario
    App.prototype.handleCreate = function (e) {
        e.preventDefault();
        var product = this.ui.getProductInput();
        var quantity = this.ui.getQuantityInput();
        if (!product || quantity < 1)
            return;
        // Shipping Office crea la requisición en la lista
        this.shipping.prepareRequisition(this.list, product, quantity);
        this.ui.resetForm();
        this.ui.renderTable(this.list);
    };
    // Delega el click de la tabla al botón correcto
    App.prototype.handleTableClick = function (e) {
        var _a;
        var target = e.target;
        var id = parseInt((_a = target.dataset["id"]) !== null && _a !== void 0 ? _a : "0");
        if (!id)
            return;
        if (target.classList.contains("btn-advance"))
            this.advance(id);
        if (target.classList.contains("btn-log"))
            this.showLog(id);
        if (target.classList.contains("btn-del"))
            this.delete(id);
    };
    App.prototype.advance = function (id) {
        var _a;
        var order = this.list.findById(id);
        if (!order)
            return;
        // Máquina de estados que replica el flujo exacto del diagrama
        switch (order.status) {
            case "requisition":
                order.status = "quote_request";
                order.log.push("🧑 Buyer Agent: Preparando solicitud RFQ");
                break;
            case "quote_request": {
                var needs = confirm("Pedido #".concat(order.id, ": \u00BFNecesita revisi\u00F3n del Supervisor?"));
                this.buyer.prepareQuoteRequest(order, needs);
                break;
            }
            // Aprueba o rechaza la solicitud
            case "needs_supervisor": {
                var ok = confirm("Supervisor: \u00BFAprobar solicitud del pedido #".concat(order.id, "?"));
                this.supervisor.evaluate(order, ok);
                break;
            }
            // Decide si cotizar y asigna el valor
            case "review_quotation": {
                var decide = confirm("Seller: \u00BFDecide cotizar el pedido #".concat(order.id, "?"));
                var val = decide
                    ? parseFloat(prompt("Seller: Ingresa el valor de cotización ($):") || "0")
                    : 0;
                this.seller.prepareQuote(order, decide, val);
                break;
            }
            // Reenvía cotización revisada al Buyer
            case "analyze_quote":
                order.status = "actual_quote_review";
                order.log.push("🏪 Seller: Cotización revisada reenviada 🔄");
                break;
            // Acepta o rechaza la cotización
            case "actual_quote_review": {
                var accept = confirm("Buyer Agent: \u00BFCotizaci\u00F3n $".concat(order.quote, " aceptable para pedido #").concat(order.id, "?"));
                this.buyer.reviewQuote(order, accept);
                break;
            }
            // Envía la orden al Seller
            case "order_preparation":
                order.status = "order_review";
                order.log.push("🧑 Buyer Agent: Orden enviada al Seller");
                break;
            // Acepta o rechaza la orden
            case "order_review": {
                var ok = confirm("Seller: \u00BFAceptar la orden #".concat(order.id, "?"));
                this.seller.reviewOrder(order, ok);
                break;
            }
            // Prepara la factura con IVA
            case "fulfill_order":
                this.seller.prepareInvoice(order);
                break;
            // Recibe el producto y cierra el pedido
            case "receive_product":
                this.receiver.receiveProduct(order);
                alert("\u2705 Pedido #".concat(order.id, " completado\nFactura: $").concat((_a = order.invoice) === null || _a === void 0 ? void 0 : _a.toFixed(2)));
                break;
        }
        this.ui.renderTable(this.list);
    };
    // Muestra el historial de pasos del pedido
    App.prototype.showLog = function (id) {
        var order = this.list.findById(id);
        if (order)
            this.ui.showLog(order);
    };
    // Elimina el pedido de la lista previa confirmación
    App.prototype.delete = function (id) {
        if (!confirm("\u00BFEliminar pedido #".concat(id, "?")))
            return;
        this.list.remove(id);
        this.ui.renderTable(this.list);
    };
    return App;
}());
exports.App = App;
document.addEventListener("DOMContentLoaded", function () {
    new App().init();
});
