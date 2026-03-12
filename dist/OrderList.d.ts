import { IOrder, IOrderList, OrderStatus } from "./types";
export declare class OrderList implements IOrderList {
    private orders;
    private nextId;
    add(product: string, quantity: number): IOrder;
    findById(id: number): IOrder | undefined;
    getAll(): IOrder[];
    remove(id: number): void;
    count(): number;
    updateStatus(id: number, status: OrderStatus, logEntry: string): void;
}
