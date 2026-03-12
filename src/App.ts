

import { OrderList }    from "./OrderList";
import { UIRenderer }   from "./UIRenderer";
import { ShippingOffice, BuyerAgent, Supervisor, Seller, ReceiveAgent } from "./actors";

export class App {
  // Instancias de todos los componentes del sistema
  private readonly list       = new OrderList();
  private readonly ui         = new UIRenderer();
  private readonly shipping   = new ShippingOffice();
  private readonly buyer      = new BuyerAgent();
  private readonly supervisor = new Supervisor();
  private readonly seller     = new Seller();
  private readonly receiver   = new ReceiveAgent();

  // Inicializa la app
  init(): void {
    document.getElementById("order-form")!
      .addEventListener("submit", (e) => this.handleCreate(e));

    // Delegación de eventos
    document.getElementById("order-body")!
      .addEventListener("click", (e) => this.handleTableClick(e));

    this.ui.renderTable(this.list);
  }

  // Maneja la creación de un nuevo pedido desde el formulario
  private handleCreate(e: Event): void {
    e.preventDefault();
    const product  = this.ui.getProductInput();
    const quantity = this.ui.getQuantityInput();
    if (!product || quantity < 1) return;

    // Shipping Office crea la requisición en la lista
    this.shipping.prepareRequisition(this.list, product, quantity);
    this.ui.resetForm();
    this.ui.renderTable(this.list);
  }

  // Delega el click de la tabla al botón correcto
  private handleTableClick(e: Event): void {
    const target = e.target as HTMLElement;
    const id     = parseInt(target.dataset["id"] ?? "0");
    if (!id) return;

    if (target.classList.contains("btn-advance")) this.advance(id);
    if (target.classList.contains("btn-log"))     this.showLog(id);
    if (target.classList.contains("btn-del"))     this.delete(id);
  }

  private advance(id: number): void {
    const order = this.list.findById(id);
    if (!order) return;

    // Máquina de estados que replica el flujo exacto del diagrama
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

      // Aprueba o rechaza la solicitud
      case "needs_supervisor": {
        const ok = confirm(`Supervisor: ¿Aprobar solicitud del pedido #${order.id}?`);
        this.supervisor.evaluate(order, ok);
        break;
      }

      // Decide si cotizar y asigna el valor
      case "review_quotation": {
        const decide = confirm(`Seller: ¿Decide cotizar el pedido #${order.id}?`);
        const val    = decide
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
        const accept = confirm(`Buyer Agent: ¿Cotización $${order.quote} aceptable para pedido #${order.id}?`);
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
        const ok = confirm(`Seller: ¿Aceptar la orden #${order.id}?`);
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
        alert(`✅ Pedido #${order.id} completado\nFactura: $${order.invoice?.toFixed(2)}`);
        break;
    }

    this.ui.renderTable(this.list);
  }

  // Muestra el historial de pasos del pedido
  private showLog(id: number): void {
    const order = this.list.findById(id);
    if (order) this.ui.showLog(order);
  }

  // Elimina el pedido de la lista previa confirmación
  private delete(id: number): void {
    if (!confirm(`¿Eliminar pedido #${id}?`)) return;
    this.list.remove(id);
    this.ui.renderTable(this.list);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App().init();
});