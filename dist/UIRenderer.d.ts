import { IOrder, IOrderList } from "./types";
export declare class UIRenderer {
    private readonly tableBodyId;
    private readonly formId;
    private readonly productId;
    private readonly quantityId;
    renderTable(list: IOrderList): void;
    private renderRow;
    resetForm(): void;
    showLog(order: IOrder): void;
    getProductInput(): string;
    getQuantityInput(): number;
}
