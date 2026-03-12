type OrderStatus =
  | "requisition"
  | "quote_request"
  | "needs_supervisor"
  | "quote_evaluation"
  | "review_quotation"
  | "quote_preparation"
  | "analyze_quote"
  | "actual_quote_review"
  | "order_preparation"
  | "order_review"
  | "fulfill_order"
  | "prepare_invoice"
  | "receive_product"
  | "cancelled";

interface IOrder {
  id: number;
  product: string;
  quantity: number;
  status: OrderStatus;
  quote: number | null;
  invoice: number | null;
  needsReview: boolean;
  log: string[];
  createdAt: Date;
}

interface IOrderList {
  add(product: string, quantity: number): IOrder;
  findById(id: number): IOrder | undefined;
  getAll(): IOrder[];
  remove(id: number): void;
  count(): number;
}