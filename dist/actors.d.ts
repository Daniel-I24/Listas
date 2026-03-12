import { IOrder, IOrderList } from "./types";
export declare class ShippingOffice {
    prepareRequisition(list: IOrderList, product: string, qty: number): IOrder;
}
export declare class BuyerAgent {
    prepareQuoteRequest(order: IOrder, needsReview: boolean): void;
    reviewQuote(order: IOrder, acceptable: boolean): void;
}
export declare class Supervisor {
    evaluate(order: IOrder, approves: boolean): void;
}
export declare class Seller {
    prepareQuote(order: IOrder, decides: boolean, quoteValue: number): void;
    reviewOrder(order: IOrder, acceptable: boolean): void;
    prepareInvoice(order: IOrder): void;
}
export declare class ReceiveAgent {
    receiveProduct(order: IOrder): void;
}
