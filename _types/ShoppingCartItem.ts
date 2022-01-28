import {MenuItemObject} from "./MenuItemModel";

export interface ShoppingCartItem {
    price: number,
    option: Array<string>,
    amount: number,
    name: string,
    id: string,
}

export interface ShoppingCartList {
    totalPrice: number,
    items: Array<ShoppingCartItem>
}