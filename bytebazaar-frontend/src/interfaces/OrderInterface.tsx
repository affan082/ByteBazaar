export interface Order {
    _id: string;
    sessionId: string;
    status: string;
    orderAmount: number;
    currency: string;
    createdAt: string;
    cart: {
        product: {
            _id: string;
            name: string;
            price: number;
        };
        quantity: number;
    }[];
}
