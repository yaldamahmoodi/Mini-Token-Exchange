import {OrderStatus} from "./order-status.enum";
import {OrderDomainError} from "./order-domain-error";

export class Order {
    constructor(
        public readonly id: string | null,
        public userId: string,
        public originToken: string,
        public destinationToken: string,
        public amount: number,
        public status: OrderStatus = OrderStatus.PENDING
    ) {
        this.validateBusinessRules();
    }

    private validateBusinessRules() {
        if (this.amount < 0.5) {
            throw new OrderDomainError("Order amount must be greater than 0.5");
        }
    }

    execute() {
        if (this.status !== OrderStatus.PENDING) {
            throw new OrderDomainError(
                "Order cannot be executed unless it is in PENDING status."
            );
        }

        this.status = OrderStatus.EXECUTED;
    }

    cancel() {
        if (this.status !== OrderStatus.PENDING) {
            throw new OrderDomainError(
                "Order cannot be canceled unless it is in PENDING status."
            );
        }

        this.status = OrderStatus.CANCELED;
    }
}
